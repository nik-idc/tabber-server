const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const rootRoute = require('./root.route');
const userRoute = require('./user.route');
const tabRoute = require('./tab.route');
const signinRoute = require('./signin.route');
const signupRoute = require('./signup.route');

function setupRoutes(app) {
  // Setup app
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());

  // Configure routes
  app.use('/', rootRoute);
  app.use('/api/user', userRoute);
  app.use('/api/tabs', tabRoute);
  app.use('/api/signin', signinRoute);
  app.use('/api/signup', signupRoute);
};

module.exports = setupRoutes;