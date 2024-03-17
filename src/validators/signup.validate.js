const { query, param, body, header, cookie } = require("express-validator");
const validateResult = require("./../middleware/validateRequest");

/**
 * Class responsible for handling sign-up related HTTP route validation
 */
class SignupValidator {
  signup = [
    body("email").isString().withMessage("'email' not string"),
    body("username").isString().withMessage("'username' not string"),
    body("password").isString().withMessage("'password' not string"),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];
}

const signupValidator = new SignupValidator();
module.exports = { SignupValidator, signupValidator };
