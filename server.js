const express = require("express");
const { db } = require("./src/db/db");
const env = require("./src/config/env");
const { router } = require("./src/router/router");

const main = async () => {
  const app = express();

  router.setup(app);

  db.sync();

  app.listen(env.app.port, () => {
    console.log(
      `'${env.app.name}' started and listening on port ${env.app.port}`
    );
  });
};

main();
