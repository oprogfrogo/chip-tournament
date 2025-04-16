'use strict';

//Checking the crypto module
const crypto = require('crypto');
const pino = require('pino');
const logger = pino();

// Decrypting text
function decrypt(encryptedText, key, iv) {
    logger.info(`cryptKey2---------------${key}`)
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

//Encrypting text
function encrypt(text, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

module.exports = {
    decrypt,
    encrypt
};
