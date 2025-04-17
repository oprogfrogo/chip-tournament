'use strict';

const pino = require('pino');
const logger = pino();
const mysql = require('mysql2/promise');
const localDb = require('../../config/database').localDb;
const local = mysql.createPool(localDb);

const checkExistingRegistrations = async (email) => {

    const sql = `
        SELECT *
        FROM chip_tournaments.users
        WHERE email = ?
    `;

    try {
        const result = await local.query(sql, [email]);
        logger.info('checkExistingRegistrations: ', result[0].length);
        if(result[0].length > 0) {
            return true;
        } else {
            return false;
        }
    }
    catch (error) {
        logger.error(`SQL: ${sql}`);
        logger.error(`PARAMS: ${JSON.stringify(obj)}`);
        throw error;
    }
};

const getExistingRegistrations = async (email) => {

    const sql = `
        SELECT *
        FROM chip_tournaments.users
        WHERE email = ?
    `;

    try {
        const [result] = await local.query(sql, [email]);
        logger.info('checkExistingRegistrations: ', result[0].length);
        if(result.length > 0) {
            return result[0];
        } else {
            return false;
        }
    }
    catch (error) {
        logger.error(`SQL: ${sql}`);
        logger.error(`PARAMS: ${email}`);
        throw error;
    }
};

const getExistingRegistrationById = async (id) => {

    const sql = `
        SELECT *
        FROM chip_tournaments.users
        WHERE id = ?
    `;

    try {
        const [result] = await local.query(sql, [id]);
        logger.info('checkExistingRegistrations: ', result[0].length);
        if(result.length > 0) {
            return result[0];
        } else {
            return false;
        }
    }
    catch (error) {
        logger.error(`SQL: ${sql}`);
        logger.error(`PARAMS: ${JSON.stringify(obj)}`);
        throw error;
    }
};

const insertRegistration = async (obj) => {

    const sql = `
        INSERT INTO chip_tournaments.users
        (full_name, password, ip, email, mobile, carrier, created_at, updated_at)
        VALUES
        (?,?,?,?,?,?,NOW(),NOW())
    `;

    try {
        const result = await local.query(sql, [obj.fullName, JSON.stringify(obj.password), obj.ip, obj.email, obj.mobile, obj.carrier]);
        logger.info('insertRegistration: ', result[0].length);
        return result[0][0];
    }
    catch (error) {
        logger.error(`SQL: ${sql}`);
        logger.error(`PARAMS: ${JSON.stringify(obj)}`);
        throw error;
    }
};

const updatePassword = async (ref, password) => {

    const sql = `
        UPDATE chip_tournaments.users
        SET
        password = ?
        WHERE id = ?
    `;

    try {
        await local.query(sql, [password, ref]);
        return true;
    }
    catch (error) {
        logger.error(`SQL: ${sql}`);
        return false;
    }
};

const updateResetRequestAt = async (id) => {

    const sql = `
        UPDATE chip_tournaments.users
        SET
        reset_requested_at = NOW()
        WHERE id = ?
    `;

    try {
        await local.query(sql, [id]);
        logger.info('insertRegistration: ', result[0].length);
        return true;
    }
    catch (error) {
        logger.error(`SQL: ${sql}`);
        logger.error(`PARAMS: ${id}`);
        return false;
    }
};

module.exports = {
    checkExistingRegistrations,
    getExistingRegistrations,
    getExistingRegistrationById,
    insertRegistration,
    updatePassword,
    updateResetRequestAt
};
