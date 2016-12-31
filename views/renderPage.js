const _ = require('lodash')
const path = require('path')
const fs = require('fs')

const mainLayout = require('../views/layouts/main');
const homeTemplate = require('../views/home');

const initialState = require('../client/store/initialState.js')
const dataPath = path.join(__dirname, '..', 'data')

function renderPage (pageString) {
  return mainLayout({
    body: pageString,
    initialState: initialState
  })
}

function renderHomePage () {
  console.info('render home page')
  return renderPage(
    homeTemplate({
      "posts": JSON.parse(fs.readFileSync(path.join(__dirname, '../data/raw.json'), 'utf8')),
    })
  )
}

module.exports = {
  page: renderPage,
  home: renderHomePage
}
