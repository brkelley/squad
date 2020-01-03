const camelCase = require('lodash/camelCase');

const tableRows = {
    users: [
        'id',
        'first_name',
        'last_name',
        'summoner_id',
        'email',
        'hash',
        'salt',
        'role',
        'summoner_name'
    ]
}

const convertObjectToKeyValues = (obj, table) => {
    const rows = tableRows[table];
    return rows.reduce((keyValArr, row) => {
        keyValArr.push({ key: row, value: obj[camelCase(row)] });
        return keyValArr;
    }, []);
};

module.exports = { convertObjectToKeyValues };
