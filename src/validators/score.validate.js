const {
  query,
  param,
  body,
  header,
  cookie,
  check,
} = require("express-validator");
const multer = require("multer");
const validateResult = require("../middleware/validateRequest");

/**
 * Class responsible for handling score-related HTTP route validation
 */
class ScoreValidator {
  getScore = [
    param("scoreId").isNumeric().withMessage("'scoreId' not numeric"),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];

  createScore = [
    body("name").isString().withMessage("'name' not string"),
    body("artist").isString().withMessage("'artist' not string"),
    body("song").isString().withMessage("'song' not string"),
    body("isPublic").isBoolean().withMessage("'isPublic' not boolean"),
    body("tracks").isJSON().withMessage("'tracks' not JSON"),
    body("userId").isNumeric().withMessage("'userId' not numeric"),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];

  updateScore = [
    param("scoreId").isNumeric().withMessage("'scoreId' not numeric"),
    body("name").isString().withMessage("'name' not string"),
    body("artist").isString().optional(),
    body("song").isString().optional(),
    body("isPublic").isBoolean().optional(),
    body("tracks").isJSON().optional(),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];

  deleteScore = [
    param("scoreId").isNumeric().withMessage("'scoreId' not numeric"),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];

  upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      // fileSize: 10 * 1024 * 1024, // 10MB limit
      fileSize: 100 * 1024 * 1024, // 100MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== "audio/wav" && file.mimetype !== "audio/x-wav") {
        return cb(new Error("Only .wav files are allowed"));
      }
      cb(null, true);
    },
  });

  /**
   * Validates that a request has the necessary audio file
   * @param {import("express").Request} req Request
   * @param {import("express").Response} res Response
   * @param {import("express").NextFunction} next Next function
   */
  validateAudioFile = (req, res, next) => {
    if (req.file === undefined) {
      return res.status(400).json({ error: "No file attached" });
    }

    if (!["audio/wav", "audio/x-wav"].includes(req.file.mimetype)) {
      return res
        .status(400)
        .json({ error: "Invalid file type, only .wav accepted" });
    }

    next();
  };

  transcribe = [
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];

  getTranscription = [
    query("transcription_id")
      .isInt()
      .withMessage("'transcription_id' not integer"),
    query("filename").isString().withMessage("'filename' not string"),
    query("name").isString().withMessage("'name' not string"),
    query("artist").isString().withMessage("'artist' not string"),
    query("song").isString().withMessage("'song' not string"),
    query("isPublic").isBoolean().withMessage("'isPublic' not boolean"),
    (req, res, next) => {
      validateResult(req, res, next);
    },
  ];
}

const scoreValidator = new ScoreValidator();
module.exports = { ScoreValidator, scoreValidator };
