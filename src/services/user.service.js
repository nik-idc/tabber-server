const crypto = require("crypto");
const env = require("./../config/env");
const { DB, db } = require("./../db/db");
const { JwtAuth, jwtAuth } = require("./../middleware/jwtAuth");
const Tab = require("../db/models/tab.model");

/**
 * Class responsible fir user-related business logic
 */
class UserService {
  /**
   * Constructs a new UserService object
   * @param {DB} db Database
   * @param {JwtAuth} jwtAuth JwtAuth
   */
  constructor(db, jwtAuth) {
    this.db = db;
    this.jwtAuth = jwtAuth;
    this.logPrefix = "User Service:";
  }

  /**
   * Retrieves all users
   * @param {number | undefined} count Number of users to retrieve (retrieves all if undefined)
   * @returns Retrieved users
   */
  getUsers = async (count = undefined) => {
    console.log(`${this.logPrefix} Retrieving all or ${count} users...`);
    const users = await this.db.models.User.findAll({
      limit: count,
    });

    console.log(`${this.logPrefix} Retrieved all or ${count} users`);
    return users;
  };

  /**
   * Retrieves user using id
   * @param {number} id User id
   * @returns User
   */
  getUserById = async (id) => {
    console.log(`${this.logPrefix} Getting user with id '${id}'...`);
    const user = await this.db.models.User.findByPk(id);

    console.log(`${this.logPrefix} Retrieved user with id '${id}'`);
    return user;
  };

  /**
   * Retrieves user email and password
   * @param {number} email User email
   * @param {number} password User password
   * @returns User
   */
  getUserByLogin = async (email, password) => {
    console.log(`${this.logPrefix} Hashing user password...`);
    const hashedPassword = crypto
      .pbkdf2Sync(
        password,
        env.hash.secret,
        env.hash.iterations,
        env.hash.keyLength,
        env.hash.algorithm
      )
      .toString(env.hash.encoding);

    console.log(`${this.logPrefix} Getting user with email '${email}'...`);
    const user = await this.db.models.User.findOne({
      where: {
        email: email,
        password: hashedPassword,
      },
    });

    console.log(`${this.logPrefix} Retrieved user with email '${email}'`);
    return user;
  };

  /**
   * Gets all user's tabs
   * @param {string | number} userId
   * @returns All user's tabs
   */
  getUserTabs = async (userId) => {
    console.log(`${this.logPrefix} Getting tabs of user '${userId}'...`);
    const user = await this.db.models.User.findByPk(userId, {
      include: {
        model: this.db.models.Tab,
      },
    });

    console.log(`${this.logPrefix} Retrieved tabs of user '${userId}'`);
    return user.tabs;
  };

  /**
   * Creates user
   * @param {string} email Email string
   * @param {string} username Username string
   * @param {string} password Unhashed password string
   * @returns Created user
   */
  createUser = async (email, username, password) => {
    console.log(`${this.logPrefix} Hashing password...`);
    const hashedPassword = crypto
      .pbkdf2Sync(
        password,
        env.hash.secret,
        env.hash.iterations,
        env.hash.keyLength,
        env.hash.algorithm
      )
      .toString(env.hash.encoding);

    console.log(`${this.logPrefix} Creating new user...`);
    const user = await this.db.models.User.create({
      email: email,
      username: username,
      password: hashedPassword,
    });

    console.log(`${this.logPrefix} User found, signing jwt...`);
    let token = this.jwtAuth.sign({ id: user.id, username: user.username });
    console.log(`${this.logPrefix} Succesfully signed in user '${email}'`);

    const result = { user, token };

    console.log(`${this.logPrefix} Created new user`);
    return result;
  };

  /**
   * Signs user in
   * @param {string} email Email string
   * @param {string} password Unshashed password string
   * @returns Signed JWT token
   */
  signinUser = async (email, password) => {
    console.log(`${this.logPrefix} Hashing password...`);
    const hashedPassword = crypto
      .pbkdf2Sync(
        password,
        env.hash.secret,
        env.hash.iterations,
        env.hash.keyLength,
        env.hash.algorithm
      )
      .toString(env.hash.encoding);

    console.log(`${this.logPrefix} Finding user with the same login...`);
    const user = await this.db.models.User.findOne({
      where: {
        email: email,
        password: hashedPassword,
      },
    });

    if (user === null) {
      console.log(`${this.logPrefix} User not found`);
      return null;
    }

    console.log(`${this.logPrefix} User found, signing jwt...`);
    let token = this.jwtAuth.sign({ id: user.id, username: user.username });
    console.log(`${this.logPrefix} Succesfully signed in user '${email}'`);

    return { user, token };
  };

  /**
   * Updates the user
   * @param {number} id User id
   * @param {string} email Email string
   * @param {string} username Username string
   * @param {string} password Password string
   * @returns Updated user
   */
  updateUser = async (id, email, username, password) => {
    console.log(`${this.logPrefix} Hashing password...`);
    const hashedPassword = crypto
      .pbkdf2Sync(
        password,
        env.hash.secret,
        env.hash.iterations,
        env.hash.keyLength,
        env.hash.algorithm
      )
      .toString(env.hash.encoding);

    console.log(`${this.logPrefix} Updating user with id '${id}'...`);
    const user = this.db.models.User.update(
      {
        email: email,
        username: username,
        password: hashedPassword,
      },
      {
        where: {
          id: id,
        },
      }
    );

    console.log(`${this.logPrefix} Updated user with id '${id}'`);
    return user;
  };

  /**
   * Deletes user
   * @param {number} id User id
   */
  deleteUser = async (id) => {
    console.log(`${this.logPrefix} Deleting user with id '${id}'...`);
    await this.db.models.User.destroy({
      where: {
        id: id,
      },
    });

    console.log(`${this.logPrefix} Deleted user with id '${id}'`);
  };
}

const userService = new UserService(db, jwtAuth);
module.exports = { UserService, userService };
