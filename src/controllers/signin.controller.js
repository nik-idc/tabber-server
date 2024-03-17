const { StatusCodes } = require("http-status-codes");
const { UserService, userService } = require("./../services/user.service");
const { matchedData } = require("express-validator");

/**
 * Class responsible for handling sign in HTTP requests
 */
class SigninController {
  /**
   * Constructs a new SigninController object
   * @param {UserService} userService User service object
   */
  constructor(userService) {
    this.userService = userService;
    this.logPrefix = "Signin Controller:";
  }

  /**
   * Sign in endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  signin = async (req, res) => {
    const { email, password } = matchedData(req);

    try {
      console.log(
        `${this.logPrefix} Attempting to login with email '${email}'`
      );
      const { user, token } = await this.userService.signinUser(
        email,
        password
      );

      if (token === null) {
        res.status(StatusCodes.UNAUTHORIZED).send();
      } else {
        res.status(StatusCodes.OK).json({ user, token });
      }
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during signing in: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };
}

const signinController = new SigninController(userService);
module.exports = { SigninController, signinController };
