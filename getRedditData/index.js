const path = require('path');
const fs = require('fs');
const reddit = require('redwrap');

const outputPath = '/data/raw.json';
const fullDataPath = path.join(__dirname, '..', outputPath);

// read raw json file to find most recent post fetched
let currentRawJSON;
let currentRawData;
let newestPost;
let finalPostId = '57tfsu';
if (fs.existsSync(fullDataPath)) {
  currentRawJSON = fs.readFileSync(path.join(__dirname, '..', outputPath), 'utf8', err => {
    if (err) console.error('Error reading raw JSON file, proceeding with default finalPostId');
  });

  currentRawData = JSON.parse(currentRawJSON);
  if (currentRawData.fetch && currentRawData.posts && currentRawData.posts.meta) {
    // fetch every recent post up to and including this historical post
    //'57ud9o' is the first click testimony posted on r/makingsense
    //'57tfsu' is the post before the first click testimony posted on r/makingsense
    finalPostId = currentRawData.fetch && currentRawData.fetch.newestPost;
  }
}

reddit.r('MakingSense').sort('new').all(res => {
  function stopFetching () {
    res.emit('end');
  }

  let totalData = [];
  const updatedAt = Date.now();
  let newestPost = null; // id of newest post fetched
  res.on('data', function(data, res) {
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
      stopFetching();
    } else {
      totalData = totalData.concat(moreData);
    }

  });

  res.on('error', function(e) {
    console.error(e);
  });

  res.on('end', function(){
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
    const postsMetaArray = [];
    const postsContent = {};
    // data about current run to include in the JSON output
    totalData.forEach(post => {
      const { selftext, id } = post;
      delete post.selftext;
      const postMeta = Object.assign({hidden: false, marked: false}, post);

      postsMetaArray.push(postMeta)
    })

    const postsObject = Object.assign(fetchData, {
      posts: {
        meta: postsMetaArray.concat(currentRawData ? currentRawData.posts.meta : [])
      }
    });

    fs.writeFile(path.join(__dirname, '..', outputPath), JSON.stringify(postsObject), err => {
      if (err) console.error(err)
      else console.log('Great success! All data saved')
      process.exit();
    })
  });
});

