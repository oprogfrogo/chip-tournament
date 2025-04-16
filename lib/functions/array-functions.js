'use strict';

const alwaysArray = function alwaysArray(logger, element) {

    let res = []

    if (Array.isArray(element)) {
        res = element;
    } else {
        res = [element];
    }

    return res;
}

module.exports = {
    alwaysArray
};
