'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    promptId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Prompts' }
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Users' }
    },
    task: {
      allowNull: false,
      type: DataTypes.STRING
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING
    },
    round: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
    Task.belongsTo(models.Prompt, { foreignKey: 'promptId' });
    Task.belongsTo(models.User, { foreignKey: 'userId' });
  };
  return Task;
};
