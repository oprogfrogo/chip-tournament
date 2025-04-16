'use strict';

const logger = require('../logger');
const mysql = require('mysql2/promise');
const cryptDb = require('../../config/database').cryptDb;
const crypt = mysql.createPool(cryptDb);
const reportsDb = require('../../config/database').reportsDb;
const reports = mysql.createPool(reportsDb);

const decryptCardnum = async function decryptCardnum(encrypted) {

    const sql = `SELECT decryptme( ? ) as dCard`;

    const [[result]] = await crypt.query(sql, [encrypted], function (err) {
        if (err) {
            throw err;
        }
    });

    return result.dCard;
}

const getDecryptedCardnum = async function getDecryptedCardnum(customerId) {

    const sql = `SELECT ci_eaccountnum FROM production.CustomerInfo WHERE ci_idx = ?`;

    const customer = await reports.query(sql, [customerId], function (err) {
        if (err) {
            throw err;
        }
    });

    const cardnum = await decryptCardnum(customer.ci_eaccountnum);

    return cardnum;
}

module.exports = {
    decryptCardnum,
    getDecryptedCardnum
};
