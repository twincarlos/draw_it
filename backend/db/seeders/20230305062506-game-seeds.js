'use strict';

const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    options.tableName = 'Games';
    return queryInterface.bulkInsert(options, [
      {
        pin: '1234',
        stage: 'Lobby'
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    options.tableName = 'Games';
    return queryInterface.bulkDelete(options);
  }
};
