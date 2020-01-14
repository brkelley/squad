const snakeCase = require('lodash/snakeCase');

const convertObjectToKeyValues = (obj, table) => {
    const keys = Object.keys(obj);
    return keys.reduce((keyValArr, key) => {
        keyValArr.push({ key: snakeCase(key), value: obj[key] });
        return keyValArr;
    }, []);
};

module.exports = { convertObjectToKeyValues };
