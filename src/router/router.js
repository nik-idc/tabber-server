const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { SigninRouter, signinRouter } = require("./signin.route");
const { SignupRouter, signupRouter } = require("./signup.route");
const { UserRouter, userRouter } = require("./user.route");
const { TabRouter, tabRouter } = require("./tab.route");

/**
 * Class responsible for handling all HTTP routes
 */
class Router {
  /**
   * Constructs a new Router object
   * @param {SigninRouter} signinRouter Signin Router
   * @param {SignupRouter} signupRouter Signup Router
   * @param {UserRouter} userRouter User Router
   * @param {TabRouter} tabRouter Tab Router
   */
  constructor(userRouter, signinRouter, signupRouter, tabRouter) {
    this.signinRouter = signinRouter;
    this.signupRouter = signupRouter;
    this.userRouter = userRouter;
    this.tabRouter = tabRouter;
  }

  /**
   * Sets up signup router
   * @param {express.Application} app Express app
   */
  setup = (app) => {
    app.use(cors());
    app.use(cookieParser());
    app.use(express.json());

    this.signinRouter.setup(app);
    this.signupRouter.setup(app);
    this.userRouter.setup(app);
    this.tabRouter.setup(app);
  };
}

const router = new Router(signinRouter, signupRouter, userRouter, tabRouter);
module.exports = { Router, router };
