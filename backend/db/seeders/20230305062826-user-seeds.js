'use strict';

const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        username: 'Demo1',
        hashedPassword: bcrypt.hashSync('password'),
        profilePicture: 'https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png',
        gameId: 1,
        isHost: true
      },
      {
        username: 'Demo2',
        hashedPassword: bcrypt.hashSync('password'),
        profilePicture: 'https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png',
        gameId: 1,
        isHost: false
      },
      {
        username: 'Demo3',
        hashedPassword: bcrypt.hashSync('password'),
        profilePicture: 'https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png',
        gameId: 1,
        isHost: false
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    options.tableName = 'Users';
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo1', 'Demo2', 'Demo3'] }
    }, {});
  }
};
