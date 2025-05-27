const { StatusCodes } = require("http-status-codes");
const { matchedData } = require("express-validator");
const { ScoreService, scoreService } = require("../services/score.service");
const { UtilService, utilService } = require("../services/util.service");
const MidiToScoreService = require("../services/score-parser.service");

/**
 * Class responsible for handling score-related HTTP requests
 */
class ScoreController {
  /**
   * Constructs a new ScoreController object
   * @param {ScoreService} scoreService Score service object
   * @param {UtilService} utilService Util service object
   */
  constructor(scoreService, utilService) {
    this.scoreService = scoreService;
    this.utilService = utilService;
    this.logPrefix = "Score Controller:";
  }

  /**
   * Get score endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  getScore = async (req, res) => {
    const { scoreId } = matchedData(req);

    try {
      console.log(
        `${this.logPrefix} Get score endpoint hit, retrieving score...`
      );
      const score = await this.scoreService.getScore(scoreId);

      res.status(StatusCodes.OK).json(score);
      console.log(`${this.logPrefix} Get score endpoint succesfull`);
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during getting score: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };

  /**
   * Create score endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  createScore = async (req, res) => {
    const { name, artist, song, isPublic, tracks, userId } = matchedData(req);
    try {
      console.log(
        `${this.logPrefix} Create score endpoint hit, creating score...`
      );
      const score = await this.scoreService.createScore(
        name,
        artist,
        song,
        isPublic,
        tracks,
        userId
      );

      console.log(`${this.logPrefix} Create score endpoint succesfull`);
      res.status(StatusCodes.OK).json(score);
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during creating score: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };

  /**
   * Update score endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  updateScore = async (req, res) => {
    const { scoreId, name, artist, song, isPublic, tracks } = matchedData(req);
    try {
      console.log(
        `${this.logPrefix} Update score endpoint hit, updating score...`
      );
      const score = await this.scoreService.updateScore(
        scoreId,
        name,
        artist,
        song,
        isPublic,
        tracks
      );

      res.status(StatusCodes.OK).json(score);
      console.log(`${this.logPrefix} Update score endpoint succesfull`);
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during updating score: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };

  /**
   * Delete score endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  deleteScore = async (req, res) => {
    const { scoreId } = matchedData(req);
    try {
      console.log(
        `${this.logPrefix} Delete score endpoint hit, deleting score...`
      );
      await this.scoreService.deleteScore(scoreId);

      res.status(StatusCodes.OK).send();
      console.log(`${this.logPrefix} Delete score endpoint succesfull`);
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during deleting score: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };

  /**
   * Transcribe endpoint
   * @param {import("express").Request} req Request
   * @param {import("express").Response} res Response
   */
  transcribe = async (req, res) => {
    const userId = req.body.id;

    try {
      const nameNoExt = req.file.originalname.substring(
        // 0123456789
        // input1.wav
        0,
        req.file.originalname.length - 4
      );

      const { initData, filename, reqError } =
        await this.scoreService.transcribe(nameNoExt, userId, req.file.buffer);

      if (reqError === undefined) {
        res.status(StatusCodes.OK).json({ initData, filename });
        console.log(`${this.logPrefix} Transcription endpoint succesfull`);
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: `Error making request to tabber-mt3: ${reqError}`,
          error: reqError.toJSON(),
        });
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(`Internal error: ${error}`);
    }
  };

  /**
   * Get/check transcription endpoint
   * @param {import("express").Request} req Request
   * @param {import("express").Response} res Response
   */
  getTranscription = async (req, res) => {
    const { transcription_id, filename, name, artist, song, isPublic } =
      matchedData(req);
    try {
      const paths = this.scoreService.getTranscription(filename);

      if (paths === undefined) {
        res
          .status(StatusCodes.ACCEPTED)
          .json({ msg: "Transcription not done yet" });
        console.log(`${this.logPrefix} Transcription not done yet`);
      } else {
        // Step 1: Parse MIDI file
        const tabberData = this.scoreService.parseMIDItoScore(
          paths.transcriptionPath,
          transcription_id,
          name,
          artist,
          song,
          isPublic
        );

        // Step 2: Update tab
        await this.scoreService.updateScore(
          transcription_id,
          tabberData.name,
          tabberData.artist,
          tabberData.song,
          tabberData.isPublic,
          tabberData.tracks
        );

        // Step 3: Send response
        res.status(StatusCodes.OK).json(tabberData);
        console.log(
          `${this.logPrefix} Transcription done, sending tabber data`
        );

        // Step 4: Clean up no longer necessary files
        this.utilService.deleteFile(paths.transcriptionPath);
        this.utilService.deleteFile(paths.uploadPath);
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(`Internal error: ${error}`);
    }
  };
}

const scoreController = new ScoreController(scoreService, utilService);
module.exports = { ScoreController, scoreController };
