'use strict';

// Dependencies
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const favicon = require('serve-favicon');
const fileUpload = require('express-fileupload');
const flash = require('connect-flash');
const logger = require('morgan');
const path = require('path');
const routes = require('./routes/index');
const session = require('express-session');


// Routes
const authorization = require('./routes/authorization');
const tournaments = require('./routes/tournaments');
const app = express();

// Locals
app.locals.moment = require('moment');
// app.locals.accessControl = require('./config/accessControl');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', './layouts/application');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'NyRvXFJbUOXdeYAZ',
    name: 'chip_tournament_pro',
    saveUninitialized: true,
    resave: true,
    cookie: {
        secure: 'auto',
        httpOnly: 'auto',
        sameSite: 'strict',
        maxAge: 30 * 1000 //30 minutes
    }
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(fileUpload());

// Use Routes
app.use('/', routes);
app.use('/authorization', authorization);
app.use('/tournaments', tournaments);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
