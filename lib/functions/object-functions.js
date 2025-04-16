'use strict';

const map = require('lodash/map')

const collect = async function collect(arrayOfObjects, key) {

    return map(arrayOfObjects, key)
}

const removeObjectKeysNotInArray = async function removeObjectKeysNotInArray(object, items) {
    const newObject = Object.fromEntries(items.map(key => [key, object[key]]));

    return newObject;
}

module.exports = {
    collect,
    removeObjectKeysNotInArray
}