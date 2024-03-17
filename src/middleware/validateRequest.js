const { StatusCodes } = require("http-status-codes");
const { validationResult } = require("express-validator");

/**
 * Validate request
 * @param {import("express").Request} req Express request
 * @param {import("express").Response} res Express response
 * @param {import("express").NextFunction} next Express next function
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ errors: errors.array() });
  }

  next();
};

module.exports = validateRequest;
