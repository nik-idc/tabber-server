const { StatusCodes } = require("http-status-codes");
const { UserService, userService } = require("./../services/user.service");
const { matchedData } = require("express-validator");

/**
 * Class responsible for handling sign up HTTP requests
 */
class SignupController {
  /**
   * Constructs a new SignupController object
   * @param {UserService} userService User service object
   */
  constructor(userService) {
    this.userService = userService;
    this.logPrefix = "Signup Controller:";
  }

  /**
   * Sign up endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  signup = async (req, res) => {
    let { email, username, password } = matchedData(req);

    try {
      console.log(`${this.logPrefix} Sign up endpoint hit, signing up...`);
      const { user, token } = await this.userService.createUser(
        email,
        username,
        password
      );

      console.log(`${this.logPrefix} Sign up endpoint succesfull`);
      res.status(StatusCodes.OK).json({ user, token });
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during signing up: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };
}

const signupController = new SignupController(userService);
module.exports = { SignupController, signupController };
