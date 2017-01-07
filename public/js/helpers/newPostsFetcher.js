/* global reddit, firebase */
window.fetchNewPostsAndSave = function (subreddit) {
  return new Promise(function (resolve, reject) {
    // get finalPostId from database
    const fireRef = firebase.database().ref();
    fireRef.once('value')
      .then(function(snapshot) {
        // fetch every recent post up to and including the historical post that matches finalPostId
        //'57ud9o' is the first click testimony posted on r/makingsense <-- dont use it this id
        //'57tfsu' is the post before the first click testimony posted on r/makingsense
        // should use the post before the first one you want because of how the data manipulation works
        let finalPostId;
        const posts = snapshot.child('posts/meta').val()
        let index = 0;
        let newestCreatedAt = 0;
        for (key in posts) {
          const post = posts[key];
          if (post && !post.importedByUrl && post.createdAt > newestCreatedAt) {
            newestCreatedAt = post.createdAt;
            finalPostId = post.id;
          }
        }

        let numFetches = 0;
        const maxFetches = 10;
        let finalPostWasReached = false;
        let afterRedditPostId;

        function fetchMore() {
          return !finalPostWasReached && numFetches < maxFetches;
        };

        let totalData = [];
        function fetchPosts(callback) {
          reddit.new(subreddit).limit(100).after(afterRedditPostId).fetch(json => {
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
              moreData.splice(finalPostIndex);
              totalData = totalData.concat(moreData);
              // finalPostReached();
              finalPostWasReached = true;
              return callback();
            } else {
              totalData = totalData.concat(moreData);
              numFetches++;
              if (!fetchMore()) {
                // finalPostId was not seen, and there will be no more fetching
                return callback({code: 'FinalPostNotFound', message:'finalPostId was not seen during the data fetching, maybe the post was deleted.'});
              }
            }

            afterRedditPostId = 't3_' + moreData[moreData.length-1].id;
            callback();
          });
        }

        function finalPostReached(err) {
          if (err) {
            reject(err)
            return;
          }
          if (totalData.length === 0) {
            reject({code: 'NoNewPosts', message: 'The newest post in the database matched the newest post on reddit'})
            return;
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

      });
  });
}
