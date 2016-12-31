const _ = require('lodash');
const express = require('express');
const router = express.Router();

const mainLayout = require('../views/layouts/main');
const homeTemplate = require('../views/home');

const raw = require('../data/raw_test.json');

/* GET users listing. */
router.get('/', function(req, res) {
  const notDeletedItems = _.filter(raw, item => !item.__deleted);
  res.send(mainLayout({
    body: homeTemplate({
      heading: 'Subtitle',
      message: 'Render whatever into the template by passing information like this.',
      dataArray: notDeletedItems,
    })
  }));
});

module.exports = router;
