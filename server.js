const express = require('express');
const app = express();
const db = require('./src/db/models');
const env = require('./src/config/env');

// Setup routes
require("./src/router/router")(app);

// Create associations
require('./src/db/associations')();

// Create a Server
const port = process.env.PORT || env.app.port || 3000;
db.sequelize.sync({ alter: true }).then(() => {
  let server = app.listen(port, () => {
    let srvHost = server.address().address;
    let srvPort = server.address().port;
    console.log(`server started on host "${srvHost}", port "${srvPort}"`);
  });
})
 