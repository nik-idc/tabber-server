const {
  SignupValidator,
  signupValidator,
} = require("./../validators/signup.validate");
const { JwtAuth, jwtAuth } = require("./../middleware/jwtAuth");
const {
  SignupController,
  signupController,
} = require("./../controllers/signup.controller");

/**
 * Class responsible for handling sign-up related HTTP routes
 */
class SignupRouter {
  /**
   * Constructs a new SignupRouter object
   * @param {SignupValidator} signupValidator
   * @param {JwtAuth} jwtAuth
   * @param {SignupController} signupController
   */
  constructor(signupValidator, jwtAuth, signupController) {
    this.signupValidator = signupValidator;
    this.jwtAuth = jwtAuth;
    this.signupController = signupController;
  }

  /**
   * Sets up signup router
   * @param {import("express").Application} app Express app
   */
  setup = (app) => {
    app.post(
      "/api/signup",
      this.signupValidator.signup,
      // this.jwtAuth.auth,
      this.signupController.signup
    );
  };
}

const signupRouter = new SignupRouter(
  signupValidator,
  jwtAuth,
  signupController
);
module.exports = { SignupRouter, signupRouter };
