const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Tab = sequelize.define("tab", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  artist: {
    type: DataTypes.STRING,
  },
  song: {
    type: DataTypes.STRING,
  },
  guitar: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Tab;
