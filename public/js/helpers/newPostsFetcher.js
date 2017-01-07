/* global reddit, firebase */
window.fetchNewPosts = function (subreddit) {
  // CONSTANTS
  const MAX_POSTS_PER_ATTEMPT = 500; // default: 500 (recommended)
  const REQUEST_POSTS_LIMIT = 50; // default: 50, the reddit api allows up to 100
  const MAX_ATTEMPTS = 6;

  return new Promise(function (resolve, reject) {
    // get finalPostId from database
    const fireRef = firebase.database().ref();
    fireRef.once('value')
      .then(function(snapshot) {
        const posts = snapshot.child('posts/meta').val()
        let retry;
        let attemptNumber = 0;
        do {
          attemptNumber++;
          retry = false;
          // fetch every recent post up to and including the historical post that matches finalPostId
          //'57tfsu' is the post before the first click testimony posted on r/makingsense
          // should use the post before the first one you want because of how the data manipulation works
          let finalPostId;
          let index = 0;
          let newestToOldestPosts = Object.keys(posts).map(key => posts[key]);
          newestToOldestPosts.sort((postA, postB) => {
            return postB.createdAt - postA.createdAt;
          });
          finalPostId = newestToOldestPosts.find((post, index) => {
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

          let totalData = [];
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
                  return callback({code: 'NoNewPosts', message: 'The newest post in the database matched the newest post on Reddit.'});
                }
                return callback();
              } else {
                totalData = totalData.concat(moreData);
                numFetches++;
                if (!fetchMore()) {
                  // finalPostId was not seen, and there will be no more fetching
                  return callback({code: 'FinalPostNotFound', message:'finalPostId was not seen during the data fetching, maybe the post was deleted.'});
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
              reject({code: 'MaxAttempts', message: `Could not find the ${MAX_ATTEMPTS} newest posts, from the database, on Reddit in the newest ${MAX_POSTS_PER_ATTEMPT} posts`});
              return;
            }
            if (err) {
              switch (err.code) {
                case 'NoMorePosts':
                case 'FinalPostNotFound':
                  retry = true;
                  console.warn(err);
                  return;
                case 'NoNewPosts':
                  resolve([]);
                  return;
                default:
                  reject(err)
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
              const postMeta = Object.assign({hidden: false, marked: false}, post);

              // push each postMeta item to the database;
            })

            // save database and exit the whole function
            resolve(totalData);
          }

          async.whilst(fetchMore, fetchPosts, finalPostReached);

      } while (retry === true && attemptNumber <= MAX_ATTEMPTS);
    });
  });
}
