const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('home',{
    heading: 'Subtitle',
    message: 'Render whatever into the template by passing information like this.'
  });
});

module.exports = router;
