const User = require("./models/user.model");
const Tab = require("./models/tab.model");

/**
 * Database class
 */
class DB {
  /**
   * Constructs a new DB instance
   * @param {Object} models Models object
   * @param {import("sequelize").ModelCtor<Model<any>>} models.User Sequelize User model
   * @param {import("sequelize").ModelCtor<Model<any>>} models.Tab Sequelize Tab model
   */
  constructor(models) {
    this.models = models;
  }

  /**
   * Creates associations
   */
  createAssociations = () => {
    // User has many tabs
    this.models.User.hasMany(this.models.Tab);
    this.models.Tab.belongsTo(this.models.User);
  };

  /**
   * Syncs models
   */
  sync = async () => {
    this.createAssociations();

    let options = { };
    await this.models.Tab.sync(options);
    await this.models.User.sync(options);
  };
}

const db = new DB({ User, Tab });
module.exports = { DB, db };
