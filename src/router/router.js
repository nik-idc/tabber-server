const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const { SigninRouter, signinRouter } = require("./signin.route");
const { SignupRouter, signupRouter } = require("./signup.route");
const { UserRouter, userRouter } = require("./user.route");
const { ScoreRouter, scoreRouter } = require("./score.route");

/**
 * Class responsible for handling all HTTP routes
 */
class Router {
  /**
   * Constructs a new Router object
   * @param {SigninRouter} signinRouter Signin Router
   * @param {SignupRouter} signupRouter Signup Router
   * @param {UserRouter} userRouter User Router
   * @param {ScoreRouter} scoreRouter Score Router
   */
  constructor(userRouter, signinRouter, signupRouter, scoreRouter) {
    this.signinRouter = signinRouter;
    this.signupRouter = signupRouter;
    this.userRouter = userRouter;
    this.scoreRouter = scoreRouter;
  }

  /**
   * Sets up signup router
   * @param {express.Application} app Express app
   */
  setup = (app) => {
    app.use(cors());
    app.use(cookieParser());
    app.use(express.json({limit: "10mb"}));
    // // Fix 'payload too large' issue
    // app.use(bodyParser.json({ limit: "10mb" }));
    // app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

    this.signinRouter.setup(app);
    this.signupRouter.setup(app);
    this.userRouter.setup(app);
    this.scoreRouter.setup(app);
  };
}

const router = new Router(signinRouter, signupRouter, userRouter, scoreRouter);
module.exports = { Router, router };
