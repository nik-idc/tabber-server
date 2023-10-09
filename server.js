const express = require('express');
const app = express();
const db = require('./src/db/models');
const env = require('./src/config/env');
const { redisConfig } = require('./src/config/redis.config');
const { listenRedisEvents } = require('./src/redis/eventListener');

// Setup routes
require("./src/router/router")(app);

// Create associations
require('./src/db/associations')();

// Create a Server
const port = process.env.port || env.app.port || 3000;
db.sequelize.sync(/*{ alter: true }*/).then(() => {
  // Listen to incoming redis events
  listenRedisEvents();

  // Create server and listen to incoming requests on it
  let server = app.listen(port, () => {
    let srvHost = server.address().address;
    let srvPort = server.address().port;
    console.log(`server started on host "${srvHost}", port "${srvPort}"`);
  });
})
