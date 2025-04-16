'use strict';

const logger = require('../logger');

const generateProductCode = async function generateProductCode(productId, siIdx, productCodeCount) {

    String.prototype.tr = function (from, to) {
        const trMap = {};
        from.split('').forEach((f, i) => {
            trMap[f] = to[i] || to[to.length - 1];
        });
        return this.replace(/./g, ch => trMap[ch] || ch);
    };

    let alpha = siIdx.toString().tr('1234567890','cevijoruwa');
    alpha = alpha + productCodeCount++ + 'p' + productId;
    logger.info('generated Product Code: ', alpha);
    return alpha;
};

const pluralize = async function pluralize(count, noun) {

    const suffix = 's';

    return `${count} ${noun}${count !== 1 ? suffix : ''}`;
};

module.exports = {
    generateProductCode,
    pluralize
};
