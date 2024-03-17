const {
  SigninValidator,
  signinValidator,
} = require("./../validators/signin.validate");
const { JwtAuth, jwtAuth } = require("./../middleware/jwtAuth");
const {
  SigninController,
  signinController,
} = require("./../controllers/signin.controller");

/**
 * Class responsible for handling sign-in related HTTP routes
 */
class SigninRouter {
  /**
   * Constructs a new SigninRouter object
   * @param {SigninValidator} signinValidator
   * @param {JwtAuth} jwtAuth
   * @param {SigninController} signinController
   */
  constructor(signinValidator, jwtAuth, signinController) {
    this.signinValidator = signinValidator;
    this.jwtAuth = jwtAuth;
    this.signinController = signinController;
  }

  /**
   * Sets up signin router
   * @param {import("express").Application} app Express app
   */
  setup = (app) => {
    app.post(
      "/api/signin",
      this.signinValidator.signin,
      // this.jwtAuth.auth,
      this.signinController.signin
    );
  };
}

const signinRouter = new SigninRouter(
  signinValidator,
  jwtAuth,
  signinController
);
module.exports = { SigninRouter, signinRouter };
