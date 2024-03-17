const { query, param, body, header, cookie } = require("express-validator");
const validateResult = require("./../middleware/validateRequest");

/**
 * Class responsible for handling sign-in related HTTP route validation
 */
class SigninValidator {
  signin = [
    body("email").isString().withMessage("'email' not string"),
    body("password").isString().withMessage("'password' not string"),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];
}

const signinValidator = new SigninValidator();
module.exports = { SigninValidator, signinValidator };
