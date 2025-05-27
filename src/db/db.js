const User = require("./models/user.model");
const Score = require("./models/score.model");

/**
 * Dascorease class
 */
class DB {
  /**
   * Constructs a new DB instance
   * @param {Object} models Models object
   * @param {import("sequelize").ModelCtor<Model<any>>} models.User Sequelize User model
   * @param {import("sequelize").ModelCtor<Model<any>>} models.Score Sequelize Score model
   */
  constructor(models) {
    this.models = models;
  }

  /**
   * Creates associations
   */
  createAssociations = () => {
    // User has many scores
    this.models.User.hasMany(this.models.Score, { foreignKey: "userId" });
    this.models.Score.belongsTo(this.models.User, { foreignKey: "userId" });
  };

  /**
   * Syncs models
   */
  sync = async () => {
    this.createAssociations();

    await this.models.Score.sync();
    await this.models.User.sync();
  };
}

const db = new DB({ User, Score });
module.exports = { DB, db };
