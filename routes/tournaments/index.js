'use strict';

const config = require('../../config');
const express = require('express');
const router = express.Router();
const pino = require('pino');
const logger = pino();

router.all('*', function (req, res, next) {
    logger.info(`Logged in account: ${req.session.userEmail}`);
    if(req.session.userEmail === null) {
        req.session.store.clear();
        res.redirect('/authorization/login');
    }
    next(); // pass control to the next handler
})

router.get('/', async function (req, res) {

    const viewData = {
        flash: req.flash('flash')[0]
    };

    res.render('tournaments/index', viewData);
});

module.exports = router;
