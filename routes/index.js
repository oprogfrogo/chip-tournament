'use strict';

const config = require('../config');
const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');

/* GET home page. */
router.get('/', function (req, res) {

    if(req.cookies['ct_session'] == null) {
        res.redirect('/authorization/login');
    }

    const viewData = {
        flash: { info: '', success: '', warn: '', error: '' }
    };

    res.render('index', viewData);
});

module.exports = router;
