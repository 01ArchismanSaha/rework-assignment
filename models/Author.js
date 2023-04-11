const { DataTypes } = require("sequelize");

const sequelize = require("../util/Database");

const Author = sequelize.define("Author", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Author;
