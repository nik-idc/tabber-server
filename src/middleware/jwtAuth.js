const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const env = require("./../config/env");

/**
 * JWT Authentication class
 */
class JwtAuth {
  /**
   * JWT Auth middleware
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   * @returns
   */
  auth(req, res, next) {
    // Check if the token is present
    if (!req.headers.authorization) {
      return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized request");
    }

    // Get the token
    let token = req.headers.authorization.split(" ")[1];
    if (token === null) {
      return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized request");
    }

    // Verify the token
    let payload = jwt.verify(token, env.jwt.secret);
    if (!payload) {
      return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized request");
    }

    // Add user id to the request
    req.body.id = payload.id;

    next();
  }

  /**
   * Signs user
   * @param {Object} user User
   * @param {string | number} user.id User id
   * @param {string} user.username Username
   * @returns Signed JWT token
   */
  sign(user) {
    let tokenPayload = { id: user.id, username: user.username };
    const token = jwt.sign(tokenPayload, env.jwt.secret);
    return token;
  }
}

const jwtAuth = new JwtAuth();
module.exports = { JwtAuth, jwtAuth };
