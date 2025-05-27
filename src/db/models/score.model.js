const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Score = sequelize.define("score", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  artist: {
    type: DataTypes.STRING,
  },
  song: {
    type: DataTypes.STRING,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  tracks: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

module.exports = Score;
