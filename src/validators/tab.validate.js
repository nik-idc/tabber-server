const { query, param, body, header, cookie } = require("express-validator");
const validateResult = require("./../middleware/validateRequest");

/**
 * Class responsible for handling tab-related HTTP route validation
 */
class TabValidator {
  getTab = [
    param("tabId").isNumeric().withMessage("'tabId' not numeric"),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];

  createTab = [
    body("artist").isString().withMessage("'artist' not string"),
    body("song").isString().withMessage("'song' not string"),
    body("guitar").isJSON().withMessage("'guitar' not JSON"),
    body("bars").isJSON().withMessage("'bars' not JSON"),
    body("isPublic").isBoolean().withMessage("'isPublic' not boolean"),
    body("userId").isNumeric().withMessage("'userId' not numeric"),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];

  updateTab = [
    param("tabId").isNumeric().withMessage("'tabId' not numeric"),
    body("artist").isString().withMessage("'artist' not string"),
    body("song").isString().withMessage("'song' not string"),
    body("guitar").isJSON().withMessage("'guitar' not JSON"),
    body("bars").isJSON().withMessage("'bars' not JSON"),
    body("isPublic").isBoolean().withMessage("'isPublic' not boolean"),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];

  deleteTab = [
    param("tabId").isNumeric().withMessage("'tabId' not numeric"),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];
}

const tabValidator = new TabValidator();
module.exports = { TabValidator, tabValidator };
