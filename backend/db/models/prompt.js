'use strict';
module.exports = (sequelize, DataTypes) => {
  const Prompt = sequelize.define('Prompt', {
    gameId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Games' }
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Users' }
    }
  }, {});
  Prompt.associate = function(models) {
    // associations can be defined here
    Prompt.hasMany(models.Task, { foreignKey: 'promptId' });
    Prompt.belongsTo(models.User, { foreignKey: 'userId' });
    Prompt.belongsTo(models.Game, { foreignKey: 'gameId' });
  };
  return Prompt;
};
