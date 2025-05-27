const {
  ScoreValidator,
  scoreValidator,
} = require("../validators/score.validate");
const { JwtAuth, jwtAuth } = require("../middleware/jwtAuth");
const {
  ScoreController,
  scoreController,
} = require("../controllers/score.controller");

/**
 * Class responsible for handling score-related HTTP routes
 */
class ScoreRouter {
  /**
   * Constructs a new ScoreRouter object
   * @param {ScoreValidator} scoreValidator Score validator
   * @param {JwtAuth} jwtAuth JWT auth
   * @param {ScoreController} scoreController Score controller
   */
  constructor(scoreValidator, jwtAuth, scoreController) {
    this.scoreValidator = scoreValidator;
    this.jwtAuth = jwtAuth;
    this.scoreController = scoreController;
  }

  /**
   * Sets up score router
   * @param {import("express").Application} app Express app
   */
  setup = (app) => {
    app.get(
      "/api/score/:scoreId",
      this.scoreValidator.getScore,
      this.jwtAuth.auth,
      this.scoreController.getScore
    );

    app.post(
      "/api/score",
      this.scoreValidator.createScore,
      this.jwtAuth.auth,
      this.scoreController.createScore
    );

    app.put(
      "/api/score/:scoreId",
      this.scoreValidator.updateScore,
      this.jwtAuth.auth,
      this.scoreController.updateScore
    );

    app.delete(
      "/api/score/:scoreId",
      this.scoreValidator.deleteScore,
      this.jwtAuth.auth,
      this.scoreController.deleteScore
    );

    app.get(
      "/api/transcribe",
      this.scoreValidator.getTranscription,
      this.jwtAuth.auth,
      this.scoreController.getTranscription
    );

    app.post(
      "/api/transcribe",
      this.scoreValidator.upload.single("file"),
      this.scoreValidator.validateAudioFile,
      this.scoreValidator.transcribe,
      this.jwtAuth.auth,
      this.scoreController.transcribe
    );
  };
}

const scoreRouter = new ScoreRouter(scoreValidator, jwtAuth, scoreController);
module.exports = { ScoreRouter, scoreRouter };
