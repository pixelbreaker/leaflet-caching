var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var basicAuth = require('basic-auth');
var app = express();

var jetpack = require('fs-jetpack');
var dotenv = require('dotenv');

if(jetpack.exists('.env')){
  require('dotenv').load();
}

console.log(process.env.USER);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === process.env.USER && user.pass === process.env.PASSWORD) {
    return next();
  } else {
    return unauthorized(res);
  };
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'client')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

listen();

process.on('exit', function(err) {
  server.close();
  console.log('exit');
});

process.on('uncaughtException', function(err) {
  server.close();
  process.exit()
  console.log(err);
  console.log('uncaughtException');
  setTimeout(listen, 1000);
});

process.on('SIGTERM', function(err) {
  server.close();
  console.log('SIGTERM');
});

// express init
function listen () {
  server = app.listen(process.env.PORT || 8989);
}

module.exports = app;
