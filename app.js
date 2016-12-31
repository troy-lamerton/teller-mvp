const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const baseRoutes = require('./routes/index');
const dataRoutes = require('./routes/data');

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', baseRoutes);
app.use('/data', dataRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.redirect('/');
  next();
  // const err = new Error('Not Found');
  // err.status = 404;
  // next(err);
});

module.exports = app;
