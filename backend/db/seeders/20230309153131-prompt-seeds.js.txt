'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    options.tableName = 'Prompts';
    return queryInterface.bulkInsert(options, [
      {
        gameId: 1,
        userId: 1
      },
      {
        gameId: 1,
        userId: 2
      },
      {
        gameId: 1,
        userId: 3
      },
      {
        gameId: 1,
        userId: 4
      },
      {
        gameId: 1,
        userId: 5
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    options.tableName = 'Prompts';
    return queryInterface.bulkDelete(options);
  }
};
