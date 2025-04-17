'use strict';

const config = require('../../config');
const express = require('express');
const router = express.Router();
const pino = require('pino');
const logger = pino();
const mailer = require('../../lib/mailer');
const requestIp = require('request-ip');
const { format, getUnixTime } = require('date-fns');

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

    if(accountFound) {
        const encryptedPassword = accountFound.password.replace(/"/g, '');
        const decryptedPassword = await crypt.decrypt(encryptedPassword, cryptKey, cryptIv);

        if(decryptedPassword === password) {
            logger.info(`Password matched!`);
            req.session.userEmail = email;
            req.flash('flash', { success: `Successfully logged in!` });
            res.redirect('/tournaments');
            return;
        }
    }

    logger.info(`Incorrect login!`);
    req.flash('flash', { error: `Incorrect login!` });
    res.redirect('login');
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

router.get('/reset_new_password', async function (req, res) {

    const id = req.query.ref;
    const resetRequestedAtUnixTimeStamp = req.query.t;
    const now = getUnixTime(new Date())

    const differenceInSeconds = Math.abs(resetRequestedAtUnixTimeStamp - now);
    const fiveMinutesInSeconds = 5 * 60;

    if(differenceInSeconds > fiveMinutesInSeconds) {
        logger.info(`Expired password reset!`);
        req.flash('flash', { error: `Password reset request expired! Please try again.` });
        res.redirect('login');
    }

    const viewData = {
        flash: req.flash('flash')[0],
        ref: id
    };

    res.render('authorization/set_new_password', viewData);
});

router.post('/reset_password', async function (req, res) {

    const email = req.body.email;
    const accountFound = await queriesRegistrations.getExistingRegistrations(email);

    logger.info(`Account found for ${email}`);

    await mailer.sendEmail(
        'Chip Tournaments Pro <support@chiptournamentspro.com>',
        accountFound.email,
        'Password Reset',
        accountFound.full_name,
        `Click to reset: https://localhost:4002/authorization/reset_new_password?ref=${accountFound.id}&t=${getUnixTime(new Date())}`,
        'reset_password.ejs'
    )

    req.flash('flash', { success: `Please check your email for a reset password link` });

    await queriesRegistrations.updateResetRequestAt(accountFound.id);

    res.redirect('login');
});

router.post('/update_password', async function (req, res) {

    let password = req.body.password;
    const ref = req.body.ref;

    password = await crypt.encrypt(password, cryptKey, cryptIv);
    password = password.replace(/"/g, '');

    const updatePassword = await queriesRegistrations.updatePassword(ref, password);

    if(updatePassword) {
        req.flash('flash', { success: `Password was successfully updated` });
    } else {
        req.flash('flash', { error: `Error updating password` });
    }

    res.redirect('login');
});

module.exports = router;
