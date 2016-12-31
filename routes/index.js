const _ = require('lodash');
const fs = require('fs');
const express = require('express');
const router = express.Router();

const render = require('../views/renderPage')

const path = require('path');
const dataPath = path.join(__dirname, '..', 'data');

router.get('/', (req, res) => {
  res.send(render.home());
});

module.exports = router
