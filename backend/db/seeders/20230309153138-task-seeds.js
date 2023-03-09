'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    options.tableName = 'Tasks';
    return queryInterface.bulkInsert(options, [
      {
        promptId: 1,
        userId: 1,
        task: 'ONE',
        type: 'Guess',
        round: 1
      },
      {
        promptId: 2,
        userId: 2,
        task: 'TWO',
        type: 'Guess',
        round: 1
      },
      {
        promptId: 3,
        userId: 3,
        task: 'THREE',
        type: 'Guess',
        round: 1
      },
      {
        promptId: 4,
        userId: 4,
        task: 'FOUR',
        type: 'Guess',
        round: 1
      },
      {
        promptId: 5,
        userId: 5,
        task: 'FIVE',
        type: 'Guess',
        round: 1
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    options.tableName = 'Tasks';
    return queryInterface.bulkDelete(options);
  }
};
