const { DataTypes } = require("sequelize");

const sequelize = require("../util/Database");

const Magazine = sequelize.define("Magazine", {
  isbn: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authorEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publishedAt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Magazine;
