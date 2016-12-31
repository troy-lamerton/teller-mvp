const _ = require('lodash')
const path = require('path')
const fs = require('fs')
const reddit = require('redwrap')

// fetch every recent post up until this historical post
const finalPostId = '57ud9o'

reddit.r('MakingSense').sort('new').all(res => {
  function stopFetching () {
    res.emit('end')
  }

  let totalData = []
  res.on('data', function(data, res) {
    let moreData = data.data.children.filter(post => !post.data.stickied)
    // keep only the data I will use to display the post
    moreData = moreData.map(post => {
      const { title, url, selftext, createdAt, score, author, id } = post.data
      return {
        title,
        url,
        selftext,
        createdAt,
        score,
        author,
        id
      }
    })

    const finalPostIndex = _.findIndex(moreData, post => {
      return post.id === finalPostId
    })
    if (finalPostIndex > -1) {
      const finalPost = moreData[finalPostIndex]
      console.log(`Final post '${finalPost.title}' (id: ${finalPost.id}) reached`)
      moreData.splice(finalPostIndex + 1)
      totalData = totalData.concat(moreData)
      console.log('Total posts:', totalData.length)
      stopFetching()
    } else {
      totalData = totalData.concat(moreData)
    }

  });

  res.on('error', function(e) {
    console.error(e)
  });

  res.on('end', function(){
    console.log('End', 'Total posts:', totalData.length)
    fs.writeFile(path.join(__dirname, '..', '/data/raw.json'), JSON.stringify(totalData), err => {
      if (err) console.error(err)
      else console.log('Great success! All data saved')
      process.exit()
    })
  });
});

