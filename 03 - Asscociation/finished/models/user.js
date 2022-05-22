module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [6, 80],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      birthDate: {
        type: DataTypes.DATEONLY,
      },
      lastUpdatedPassword: DataTypes.DATE,
    },
    { underscored: true, paranoid: true }
  );

  User.associate = function (models) {
    User.hasMany(models.Todo, {
      foreignKey: {
        allowNull: false,
        name: "userId",
      },
      onDelete: "RESTRICT",
    });
  };

  return User;
};
