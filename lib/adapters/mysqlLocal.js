'use strict';

const { createPool } = require('mysql2/promise');
const pino = require('pino');
const logger = pino();

let pool = null;

const ensurePool = (databaseConfig) => {

    if (pool === null) {
        const connectionOptions = databaseConfig;

        pool = createPool(connectionOptions, {
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        pool.on('acquire', (connection) => logger.debug('Connection %d acquired', connection.threadId));

        pool.on('connection', (connection) => logger.debug('Connection made with %d', connection.threadId));

        pool.on('enqueue', () => logger.debug('Waiting for available connection slot'));

        pool.on('release', (connection) => logger.debug('Connection %d released', connection.threadId));
    }
};

const getConnection = async (handle, databaseConfig) => {

    ensurePool(databaseConfig);

    const connection = await pool.getConnection();

    try {
        await connection.query(`USE ${handle}`);

        return connection;
    }
    catch (err) {
        logger.error(err);

        throw err;
    }
};

const doQuery = async (sql, params, databaseConfig, dbName) => {

    const dbconn = await getConnection(dbName, databaseConfig);

    let rows = null;

    try {
        rows = await dbconn.query(
            sql,
            params,
            databaseConfig
        );

        dbconn.release();
    }
    catch (err) {
        dbconn.release();

        throw err;
    }
    return rows[0];
};


module.exports = {
    doQuery
};
