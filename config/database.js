'use strict';

// const processDb = {
//     user: getEnvironmentVariable('PROCESS_DATABASE_USER'),
//     database: getEnvironmentVariable('PROCESS_DATABASE_SCHEMA'),
//     password: getEnvironmentVariable('PROCESS_DATABASE_PASS'),
//     host: getEnvironmentVariable('PROCESS_DATABASE_HOST'),
//     port: getEnvironmentVariable('PROCESS_DATABASE_PORT'),
//     typeCast: function castField(field, useDefaultTypeCasting) {
//         if (field.type === 'BIT' && field.length === 1) {
//           const buffer = field.buffer();
//           return buffer ? buffer[0] === 1 : null;
//         }
//         return useDefaultTypeCasting();
//     }
// };

const localDb = {
    user: 'root',
    database: 'chip_tournaments',
    password: '',
    host: '127.0.0.1',
    port: 3306
};

module.exports = {
    localDb
};
