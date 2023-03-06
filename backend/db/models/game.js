'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    pin: {
      allowNull: false,
      type: DataTypes.CHAR(6)
    },
    stage: {
      allowNull: false,
      type: DataTypes.STRING(),
      defaultValue: 'Lobby'
    }
  }, {});
  Game.associate = function(models) {
    // associations can be defined here
    Game.hasMany(models.User, { foreignKey: 'gameId' });
  };
  return Game;
};