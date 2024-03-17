const {
  UserValidator,
  userValidator,
} = require("./../validators/user.validate");
const { JwtAuth, jwtAuth } = require("./../middleware/jwtAuth");
const {
  UserController,
  userController,
} = require("./../controllers/user.controller");

/**
 * Class responsible for handling user-related HTTP routes
 */
class UserRouter {
  /**
   * Constructs a new UserRouter object
   * @param {UserValidator} userValidator User validator
   * @param {JwtAuth} jwtAuth JWT auth
   * @param {UserController} userController User controller
   */
  constructor(userValidator, jwtAuth, userController) {
    this.userValidator = userValidator;
    this.jwtAuth = jwtAuth;
    this.userController = userController;
  }

  /**
   * Sets up user router
   * @param {import("express").Application} app Express app
   */
  setup = (app) => {
    app.get(
      "/api/user",
      this.userValidator.getUsers,
      this.jwtAuth.auth,
      this.userController.getUsers
    );

    app.get(
      "/api/user/:id",
      this.userValidator.getUser,
      this.jwtAuth.auth,
      this.userController.getUser
    );

    app.get(
      "/api/user/:userId/tabs",
      this.userValidator.getUserTabs,
      this.jwtAuth.auth,
      this.userController.getUserTabs
    );

    app.post(
      "/api/user",
      this.userValidator.createUser,
      this.jwtAuth.auth,
      this.userController.createUser
    );

    app.put(
      "/api/user/:id",
      this.userValidator.updateUser,
      this.jwtAuth.auth,
      this.userController.updateUser
    );

    app.delete(
      "/api/user/:id",
      this.userValidator.deleteUser,
      this.jwtAuth.auth,
      this.userController.deleteUser
    );
  };
}

const userRouter = new UserRouter(userValidator, jwtAuth, userController);
module.exports = { UserRouter, userRouter };
