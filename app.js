const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars')
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const routes = require('./routes/index');

const app = express();

// view engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.redirect('/');
  next();
  // const err = new Error('Not Found');
  // err.status = 404;
  // next(err);
});

module.exports = app;
