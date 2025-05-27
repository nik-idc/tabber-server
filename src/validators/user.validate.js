const { query, param, body, header, cookie } = require("express-validator");
const validateResult = require("./../middleware/validateRequest");

/**
 * Class responsible for handling user-related HTTP route validation
 */
class UserValidator {
  getUsers = [
    query("count").isNumeric().withMessage("'count' not numeric"),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];

  getUser = [
    param("id").isNumeric().withMessage("'id' not numeric"),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];

  getUserScores = [
    param("userId").isNumeric().withMessage("'userId' not numeric"),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];

  createUser = [
    body("email").isString().withMessage("'email' not string"),
    body("username").isString().withMessage("'username' not string"),
    body("password").isString().withMessage("'password' not string"),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];

  updateUser = [
    param("id").isNumeric().withMessage("'id' not numeric"),
    body("email").isString().withMessage("'email' not string"),
    body("username").isString().withMessage("'username' not string"),
    body("password").isString().withMessage("'password' not string"),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];

  deleteUser = [
    param("id").isNumeric().withMessage("'id' not numeric"),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];
}

const userValidator = new UserValidator();
module.exports = { UserValidator, userValidator };
