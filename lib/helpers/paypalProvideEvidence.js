
'use strict';

const fs = require('fs');
const path = require('path');
const logger = require('../logger');
const BOUNDARY = 'MyBoundary';
const axios = require('axios');

const createJsonPart = (fieldName, jsonPayload) => `--${BOUNDARY}\r\nContent-Disposition: form-data; name="${fieldName}"\r\n` +
    'Content-Type: application/json\r\n\r\n' +
    `${jsonPayload}\r\n`;

const createImagePart = (fieldName, filePath) => {
    const filename = path.basename(filePath);
    const fileExtension = path.extname(filePath).toLowerCase();
    let mimeType = 'application/octet-stream';

    if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
        mimeType = 'image/jpeg';
    }
    else if (fileExtension === '.png') {
        mimeType = 'image/png';
    }

    return `--${BOUNDARY}\r\nContent-Disposition: form-data; name="${fieldName}"; filename="${filename}"\r\n` +
        `Content-Type: ${mimeType}\r\n\r\n`;
};

const postData = async (token, filePath, jsonFieldName, imageFieldName, url, note, disputeId) => {

    const payload = {
        evidences: [
            {
                evidence_type: 'RECEIPT_OF_MERCHANDISE',
                evidence_info: {
                    note
                },
                notes: note
            }
        ]
    };

    const jsonPayload = JSON.stringify(payload);
    const jsonPart = createJsonPart(jsonFieldName, jsonPayload);
    const imageHeaders = createImagePart(imageFieldName, filePath);
    const imageContent = fs.readFileSync(filePath);

    const outboundData = Buffer.concat([
        Buffer.from(jsonPart, 'utf8'),
        Buffer.from(imageHeaders, 'utf8'),
        imageContent,
        Buffer.from(`\r\n--${BOUNDARY}--\r\n`, 'utf8')
    ]);

    try {
        const response = await axios.post(url,
            outboundData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': `multipart/form-data; boundary=${BOUNDARY}`
                }
            });


        const result = response.status === 200;
        const data = response.data;

        if (!result) {
            logger.error(`Error submitting evidence for ${disputeId}`);
            logger.error(data);
        }

        return result;
    }
    catch (error) {

        logger.error(`Error <postData>:${disputeId} `, error.message);
        return false;
    }
};


const postProvideEvidence = async (authToken, url, pathToImage, note, disputeId) => await postData(authToken, pathToImage, 'input', 'file1', url, note, disputeId);

module.exports = { postProvideEvidence };
