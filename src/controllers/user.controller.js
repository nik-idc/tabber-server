const { StatusCodes } = require("http-status-codes");
const { UserService, userService } = require("./../services/user.service");
const { matchedData } = require("express-validator");

/**
 * Class responsible for handling user-related HTTP requests
 */
class UserController {
  /**
   * Constructs a new UserController object
   * @param {UserService} userService User service object
   */
  constructor(userService) {
    this.userService = userService;
    this.logPrefix = "User Controller:";
  }

  /**
   * Get users endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  getUsers = async (req, res) => {
    const { count } = matchedData(req);
    try {
      console.log(
        `${this.logPrefix} Get users endpoint hit, retrieving users...`
      );
      const users = await this.userService.getUsers(count);

      res.status(StatusCodes.OK).json(users);
      console.log(`${this.logPrefix} Get users endpoint succesfull`);
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during getting users: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };

  /**
   * Get user endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  getUser = async (req, res) => {
    const { id } = matchedData(req);

    try {
      console.log(
        `${this.logPrefix} Get user endpoint hit, retrieving user...`
      );
      const user = await this.userService.getUserById(id);

      res.status(StatusCodes.OK).json(user);
      console.log(`${this.logPrefix} Get user endpoint succesfull`);
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during getting user: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };

  /**
   * Get user scores endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  getUserScores = async (req, res) => {
    const { userId } = matchedData(req);

    try {
      console.log(
        `${this.logPrefix} Get user tabs endpoint hit, retrieving user...`
      );
      const scores = await this.userService.getUserScores(userId);

      if (scores === null || scores === undefined) {
        res.status(StatusCodes.OK).json([]);
      } else {
        res.status(StatusCodes.OK).json(scores);
      }

      console.log(`${this.logPrefix} Get user tabs endpoint succesfull`);
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during getting user tabs: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };

  /**
   * Update user endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  createUser = async (req, res) => {
    const { email, username, password } = matchedData(req);
    try {
      console.log(
        `${this.logPrefix} Create user endpoint hit, creating user...`
      );
      const user = await this.userService.createUser(email, username, password);

      console.log(`${this.logPrefix} Create user endpoint succesfull`);
      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during creating user: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };

  /**
   * Update user endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  updateUser = async (req, res) => {
    const { id, email, username, password } = matchedData(req);
    try {
      console.log(
        `${this.logPrefix} Update user endpoint hit, updating user...`
      );
      const user = await this.userService.updateUser(
        id,
        email,
        username,
        password
      );

      res.status(StatusCodes.OK).json(user);
      console.log(`${this.logPrefix} Update user endpoint succesfull`);
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during updating user: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };

  /**
   * Delete user endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  deleteUser = async (req, res) => {
    const { id } = matchedData(req);
    try {
      console.log(
        `${this.logPrefix} Delete user endpoint hit, deleting user...`
      );
      await this.userService.deleteUser(id);

      res.status(StatusCodes.OK).send();
      console.log(`${this.logPrefix} Delete user endpoint succesfull`);
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during deleting user: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };
}

const userController = new UserController(userService);
module.exports = { UserController, userController };
