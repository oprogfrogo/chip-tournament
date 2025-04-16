'use strict';

const config = require('../../config');
const express = require('express');
const router = express.Router();
const pino = require('pino');
const logger = pino();
const requestIp = require('request-ip');

const crypt = require('../../lib/functions/crypt');
const cryptKey = '0RuxUBV3oFeuRdsUGrA5N24DdVWeeoF5'; // 256-bit key
const cryptIv = '0RuxUBV3oFeuRdsU';  // 128-bit IV
const queriesRegistrations = require('../../lib/queries/registrations');

router.all('*', function (req, res, next) {
    logger.info(`Logged in account: ${req.session.userEmail}`);
    if(req.session.userEmail === null) {
        req.session.destroy();
        res.redirect('/authorization/login');
    }
    next(); // pass control to the next handler
})

router.get('/login', async function (req, res) {

    const viewData = {
        flash: req.flash('flash')[0]
    };

    res.render('authorization/login', viewData);
});

router.get('/logout', async function (req, res) {

    if(req.session) {
        req.session.destroy();
    }

    res.redirect('/authorization/login');
});

router.post('/doLogin', async function (req, res) {

    const { email, password } = req.body;
    const accountFound = await queriesRegistrations.getExistingRegistrations(email);
    const encryptedPassword = accountFound.password.replace(/"/g, '');
    const decryptedPassword = await crypt.decrypt(encryptedPassword, cryptKey, cryptIv);

    if(decryptedPassword === password) {
        logger.info(`Password matched!`);
        req.session.userEmail = email;
        res.redirect('/tournaments');
    } else {
        logger.info(`Password did not match!`);
        const viewData = {
            flash: req.flash('flash')[0]
        };
    
        res.render('authorization/login', viewData);
    }

    return;
});

router.get('/register', async function (req, res) {

    const viewData = {
        flash: req.flash('flash')[0]
    };

    res.render('authorization/register', viewData);
});

router.post('/doRegister', async function (req, res) {  

    let params = req.body;

    const existingRegistration = await queriesRegistrations.checkExistingRegistrations(params.email);

    const viewData = {
        flash: req.flash('flash')[0]
    };

    if(existingRegistration) {
        req.flash('flash', { error: `Email address already registered. Please try logging in or use Forgot Password to retrieve your password.` });
        res.redirect('login');
        return
    }

    params.password = await crypt.encrypt(params.password, cryptKey, cryptIv);
    params.password = params.password.replace(/"/g, '');
    params.ip = requestIp.getClientIp(req);

    await queriesRegistrations.insertRegistration(params);    

    res.render('authorization/register', viewData);
});

router.get('/forgot_password', async function (req, res) {

    const viewData = {
        flash: req.flash('flash')[0]
    };

    res.render('authorization/forgot_password', viewData);
});

router.get('/reset_password', async function (req, res) {

    const viewData = {
        flash: req.flash('flash')[0]
    };

    res.render('authorization/forgot_password', viewData);
});

module.exports = router;
