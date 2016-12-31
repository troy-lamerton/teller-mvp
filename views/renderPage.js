const _ = require('lodash')
const path = require('path')
const fs = require('fs')

const mainLayout = require('../views/layouts/main');
const homeTemplate = require('../views/home');

const dataPath = path.join(__dirname, '..', 'data')

function renderPage (pageString) {
  return mainLayout({
    body: pageString
  })
}

function renderHomePage (raw) {
  let rawData = raw;
  if (!raw) {
    const rawDataString = fs.readFileSync(path.join(dataPath, '/raw_test.json'), 'utf8')
    rawData = (rawDataString.length > 0 && JSON.parse(rawDataString)) || 'Could not read data file'
  }
  const notHiddenItems = _.filter(rawData, item => !item.__hidden);
  return renderPage(
    homeTemplate({
      posts: rawData,
    })
  )
}

module.exports = {
  page: renderPage,
  home: renderHomePage
}
