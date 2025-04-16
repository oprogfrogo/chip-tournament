'use strict';

const logger = require('./logger');
const nodeMailer = require('nodemailer');
const ejs = require('ejs');

const transport = nodeMailer.createTransport({
    host: '127.0.0.1',
    port: '25',
    secure: false,
    logger: true,
    debug: true,
    ignoreTLS: true
    // service: "Gmail",
    // auth: {
    //     user: "simonphp@gmail.com",
    //     pass: "jsusylykjrwhbsya" //Google App Password (gmail's secured password and not the account's password. Can be revoked/regenerated in gmail, so it's good for testing)
    // }
});

const sendEmail = (from, receiver, subject, name, body, template) => {
    ejs.renderFile(process.cwd() + `/views/emailTemplates/${template}`, { name, body }, (err, data) => {
        logger.info('DATA: ', data);
        if (err) {
            logger.error('Error in sendEmail to ', receiver);
            logger.error(err);
        }
        else {
            const mailOptions = {
                from,
                to: receiver,
                subject,
                html: data
            };

            transport.sendMail(mailOptions, (error) => {
                if (error) {
                    return logger.error('Error sending email:', error);
                }
                logger.info('Email sent to:', receiver);
            });
        }
    });
};

const sendEmailWithoutTemplate = (from, receiver, cc, subject, html) => {
    const mailOptions = {
        from,
        to: receiver,
        cc,
        subject,
        html
    };

    transport.sendMail(mailOptions, (error) => {
        if (error) {
            return logger.error('Error sending email:', error);
        }
        logger.info('Email sent to:', receiver);
    });
};

const sendEmailHtmlTextAttachmentsWithoutTemplate = (from, receiver, cc, subject, html, text, attachment) => {
    const mailOptions = {
        from,
        to: receiver,
        cc,
        subject,
        html,
        text,
        attachments: [{
            filename: attachment.filename,
            path: attachment.path
        }]
    };

    transport.sendMail(mailOptions, (error) => {
        if (error) {
            return logger.error('Error sending email:', error);
        }
        logger.info('Email sent to:', receiver);
    });
};

module.exports = {
    sendEmail,
    sendEmailWithoutTemplate,
    sendEmailHtmlTextAttachmentsWithoutTemplate
};
