const env = require("./../config/env");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  env.db.database,
  env.db.username,
  env.db.password,
  {
    host: env.db.host,
    dialect: env.db.dialect,
    port: env.db.port,
    define: {
      freezeTableName: true,
    },
    pool: {
      max: 32,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    timezone: env.db.timezone,
    dialectOptions: {
      socketPath: env.db.db_socket,
    },
  }
);

module.exports = sequelize;
