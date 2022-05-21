module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define(
    "Todo",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      dueDate: DataTypes.DATEONLY,
    },
    { underscored: true }
  );
  Todo.associate = function (models) {
    Todo.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        name: "userId",
      },
      onDelete: "RESTRICT",
    });
  };

  return Todo;
};
