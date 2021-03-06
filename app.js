"use strict";
// Load environment variables
require('dotenv').load();

const 
    express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    cors = require('cors'),
    app = express();

// Configure DB & Passport
require(path.join(__dirname, 'config', 'knex.js'));
require(path.join(__dirname, 'config', 'passport.js'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());

// Routes
const routesAdmin = require('./app_api/routes/admin.index.route');
const routesApi = require('./app_api/routes/api.index.route');
const routesAuth = require('./app_api/routes/auth.index.route');

// Middleware
const ensureAuthenticated = require('./app_api/middleware/jwtauth.middleware').middleware;
const ensureAdmin = require('./app_api/middleware/authadmin.middleware').middleware;
const forward404 = require('./app_api/middleware/forward404.middleware').middleware;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth', routesAuth);
// Require authentication
app.use('/admin/v1', ensureAuthenticated, ensureAdmin, routesAdmin);
app.use('/api/v1', ensureAuthenticated, routesApi);
// catch 404 and forward to error handler
app.use(forward404);


//========================= Error Handlers =============================//

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to client
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
