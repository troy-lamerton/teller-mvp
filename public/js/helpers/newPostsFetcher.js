/* global reddit, firebase */
window.fetchNewPosts = function (subreddit) {
  // CONSTANTS
  const MAX_POSTS_PER_ATTEMPT = 100; // default: 500 (recommended)
  const REQUEST_POSTS_LIMIT = 50; // default: 50, the reddit api allows up to 100
  /* if a post in the database is removed from reddit,
   * the fetcher will not know when to stop, but it will attempt again
   * with the next newest post in the database, until MAX_ATTEMPTS is reached */
  const MAX_ATTEMPTS = 6; // default: 6

  return new Promise(function (resolve, reject) {
    // get finalPostId from database
    const fireRef = firebase.database().ref();
    fireRef.once('value')
      .then(function(snapshot) {
        const posts = snapshot.child('posts/meta').val()
        const newestToOldestPosts = Object.keys(posts).map(key => posts[key]);
        newestToOldestPosts.sort((postA, postB) => {
          return postB.createdAt - postA.createdAt;
        });
        let retry = true;
        let attemptNumber = 0;
        let totalData = [];

        async.whilst(() => (retry === true && attemptNumber <= MAX_ATTEMPTS), (retryCallback) => {
          totalData = [];
          attemptNumber++;
          retry = false;
          // fetch every recent post up to and including the historical post that matches finalPostId
          //'57tfsu' is the post before the first click testimony posted on r/makingsense
          // should use the post before the first one you want because of how the data manipulation works
          const finalPostId = newestToOldestPosts.find((post, index) => {
            if (index >= attemptNumber -1) {
              return post && !post.importedByUrl;
            }
          }).id;

          let numFetches = 0;
          let finalPostWasReached = false;
          let afterRedditPostId;

          function fetchMore() {
            return !finalPostWasReached && numFetches < MAX_POSTS_PER_ATTEMPT / REQUEST_POSTS_LIMIT;
          };

          function fetchPosts(callback) {
            reddit.new(subreddit).limit(REQUEST_POSTS_LIMIT).after(afterRedditPostId).fetch(json => {
              let moreData = json.data.children.filter(post => !post.data.stickied);
              // keep only the data I will use to display the post
              moreData = moreData.map(post => {
                const { title, url, created_utc, score, author, id } = post.data;
                return {
                  title,
                  url,
                  createdAt: created_utc,
                  score,
                  author,
                  id
                };
              })

              let finalPostIndex;
              const finalPost = moreData.find((post, index) => {
                finalPostIndex = index;
                return post.id === finalPostId;
              });
              if (finalPost) {
                finalPostWasReached = true;
                moreData.splice(finalPostIndex);
                totalData = totalData.concat(moreData);
                if (totalData.length === 0) {
                  return callback({code: 'NoNewPosts', message: `The #${attemptNumber} newest in the database matched the newest post on Reddit.`});
                }
                return callback();
              } else {
                totalData = totalData.concat(moreData);
                numFetches++;
                if (!fetchMore()) {
                  // finalPostId was not seen, and there will be no more fetching
                  return callback({code: 'FinalPostNotFound', message: `finalPostId "${finalPostId}" was not seen during the data fetching, maybe the post was deleted.`});
                }
              }
              if (!moreData[moreData.length-1]) {
                return callback({code: 'NoMorePosts', message: `The oldest post on the subreddit was reached without seeing the finalPost "${finalPostId}". Fetcher will retry with an older finalPost.`});
              }
              afterRedditPostId = 't3_' + moreData[moreData.length-1].id;
              callback();
            });
          }

          function finalPostReached(err) {
            if (attemptNumber > MAX_ATTEMPTS) {
              retryCallback({code: 'MaxAttempts', message: `Could not find the ${MAX_ATTEMPTS} newest posts, from the database, on Reddit in the newest ${MAX_POSTS_PER_ATTEMPT} posts`});
              return;
            }
            if (err) {
              switch (err.code) {
                case 'FinalPostNotFound':
                  console.warn(err);
                  retry = true;
                  retryCallback();
                  return;
                default:
                  retryCallback(err);
                  return;
              }
            }

            const fetchData = {
              newestPost: totalData[0],
              updatedAt: Date.now()
            };
            fireRef.child('fetch').set(fetchData);

            totalData.forEach(post => {
              const { selftext, id } = post;
              delete post.selftext;
            });

            retryCallback();
          }

          async.whilst(fetchMore, fetchPosts, finalPostReached);

        }, err => {
          if (err) {
            if (err.code === 'NoNewPosts') resolve(totalData);
            else reject(err);
          }
          resolve(totalData);
        });
    });
  });
}
