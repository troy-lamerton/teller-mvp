/* global reddit, firebase */
window.fetchNewPostsAndSave = function (subreddit) {
  // get finalPostId from database
  const fireRef = firebase.database().ref('fetch');
  fireRef.once('value')
    .then(function(snapshot) {
      // fetch every recent post up to and including this historical post
      //'57ud9o' is the first click testimony posted on r/makingsense <-- dont use it this id
      //'57tfsu' is the post before the first click testimony posted on r/makingsense
      // should use the post before the first one you want because of how the data manipulation works
      const finalPostId = snapshot.child('fetch/newestPost');
      console.warn(finalPostId, 'FROM DATABASE wooooooo');

      let timeout = 0
      while (timeout < 10) {
        let totalData = [];
        const updatedAt = Date.now();
        reddit.new(subreddit).all(data => {
          let moreData = data.data.children.filter(post => !post.data.stickied);
          // keep only the data I will use to display the post
          moreData = moreData.map(post => {
            const { title, url, selftext, created_utc, score, author, id } = post.data;
            return {
              title,
              url,
              selftext,
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
          })
          if (finalPost) {
            console.log(`Final post '${finalPost.title}' (id: ${finalPost.id}) reached`);
            moreData.splice(finalPostIndex);
            totalData = totalData.concat(moreData);
            console.log('Total posts:', totalData.length);
            finalPostReached();
            break;
          } else {
            totalData = totalData.concat(moreData);
            timeout++;
          }
        });
      }

      function finalPostReached() {
        if (totalData.length === 0) {
          console.log('No new posts');
          process.exit();
        }
        console.log('End', 'Total posts:', totalData.length);
        const fetchData = {
          fetch: {
            newestPost: totalData[0].id,
            updatedAt
          }
        };

        // split posts array into post meta-data and post content
        // this is to improve performance of the database that this data will go into 
        // data about current run to include in the JSON output
        totalData.forEach(post => {
          const { selftext, id } = post;
          delete post.selftext;
          const postMeta = Object.assign({hidden: false, marked: false}, post);

          // push each postMeta item to the database;
        })

        // save database and exit the whole function
        console.log('Great success! All data saved');

      }
    });
  }
}
