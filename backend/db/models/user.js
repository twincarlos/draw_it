'use strict';
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      allowNull: false,
      type: DataTypes.STRING
    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING.BINARY
    },
    profilePicture: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: 'https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png'
    },
    gameId: {
      type: DataTypes.INTEGER,
      references: { model: 'Games' },
      defaultValue: null
    },
    isHost: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
    {
      defaultScope: {
        attributes: {
          exclude: ['hashedPassword', 'createdAt', 'updatedAt']
        }
      },
      scopes: {
        currentUser: {
          attributes: { exclude: ['hashedPassword'] }
        },
        loginUser: {
          attributes: {}
        }
      }
    });

  User.prototype.toSafeObject = function () { // remember, this cannot be an arrow function
    const { id, username, profilePicture, gameId, isHost } = this; // context will be the User instance
    return { id, username, profilePicture, gameId, isHost };
  };

  User.getCurrentUserById = async function (id) {
    return await User.scope('currentUser').findByPk(id);
  };

  User.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.hashedPassword.toString());
  };

  User.login = async function ({ username, password }) {
    const { Op } = require('sequelize');
    const user = await User.scope('loginUser').findOne({ where: { username } });
    if (user && user.validatePassword(password)) {
      return await User.scope('currentUser').findByPk(user.id);
    }
  };

  User.signup = async function ({ username, password }) {
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ username, hashedPassword });
    return await User.scope('currentUser').findByPk(user.id);
  };

  User.associate = function (models) {
    // associations can be defined here
    User.belongsTo(models.Game, { foreignKey: 'gameId' });
  };

  return User;
};
