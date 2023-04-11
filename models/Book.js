const { DataTypes } = require("sequelize");

const sequelize = require("../util/Database");

const Book = sequelize.define("Book", {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Book;
