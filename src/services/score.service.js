const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { DB, db } = require("../db/db");
const { JwtAuth, jwtAuth } = require("../middleware/jwtAuth");
const MidiToScoreService = require("../services/score-parser.service");

const uploadsDir = "../tabber-transcribe/uploads";
const transcriptionsDir = "../tabber-transcribe/transcriptions";

/**
 * Class responsible for score-related business logic
 */
class ScoreService {
  /**
   * Constructs a new ScoreService object
   * @param {DB} db Dascorease
   * @param {JwtAuth} jwtAuth JwtAuth
   */
  constructor(db, jwtAuth) {
    this.db = db;
    this.jwtAuth = jwtAuth;
    this.logPrefix = "Score Service:";
  }

  /**
   * Retrieves score
   * @param {string | number} scoreId Score id
   * @returns Score
   */
  getScore = async (scoreId) => {
    console.log(`${this.logPrefix} Getting score '${scoreId}'...`);
    const score = await this.db.models.Score.findByPk(scoreId);
    for (let i = 0; i < score.tracks.length; i++) {
      if (typeof score.tracks[i] === "string") {
        score.tracks[i] = JSON.parse(score.tracks[i]);
      }
    }
    console.log(`${this.logPrefix} Retrieved score '${scoreId}'`);

    return score;
  };

  /**
   * Creates score
   * @param {string} name Name of the score
   * @param {string} artist Artist
   * @param {string} song Song
   * @param {boolean} isPublic If score is public
   * @param {Object[] | string} tracks Score tracks array
   * @param {string | number} userId User id
   * @returns Created score
   */
  createScore = async (name, artist, song, isPublic, tracks, userId) => {
    if (typeof tracks === "string") {
      tracks = JSON.parse(tracks);
    }

    console.log(`${this.logPrefix} Creating score...`);
    const score = await this.db.models.Score.create({
      name: name,
      artist: artist,
      song: song,
      isPublic: isPublic,
      tracks: tracks,
      userId: userId,
    });
    console.log(`${this.logPrefix} Created score`);

    return score;
  };

  /**
   * Updates score
   * @param {string | number} scoreId Score id
   * @param {string | undefined} name Name of the score
   * @param {string | undefined} artist Artist
   * @param {string | undefined} song Song
   * @param {boolean | undefined} isPublic Is score isPublic
   * @param {Object[] | string | undefined} tracks Score tracks array
   * @returns Updated score
   */
  updateScore = async (scoreId, name, artist, song, isPublic, tracks) => {
    const updateObj = {};
    if (name !== undefined) {
      updateObj.name = name;
    }
    if (artist !== undefined) {
      updateObj.artist = artist;
    }
    if (song !== undefined) {
      updateObj.song = song;
    }
    if (isPublic !== undefined) {
      updateObj.isPublic = isPublic;
    }
    if (tracks !== undefined) {
      if (typeof tracks === "string") {
        tracks = JSON.parse(tracks);
      }
      updateObj.tracks = tracks;
    }

    console.log(`${this.logPrefix} Updating score...`);
    const score = await this.db.models.Score.update(updateObj, {
      where: {
        id: scoreId,
      },
    });
    console.log(`${this.logPrefix} Updated score`);

    return score;
  };

  /**
   * Deletes score
   * @param {string | number} scoreId Score id
   */
  deleteScore = async (scoreId) => {
    console.log(`${this.logPrefix} Deleting score...`);
    await this.db.models.Score.destroy({
      where: {
        id: scoreId,
      },
    });
    console.log(`${this.logPrefix} Deleted score`);
  };

  /**
   * Parses MIDI file to tabber format data
   * @param {string} pathToMidi Path to the MIDI file
   * @returns Tabber format data
   */

  /**
   * Sends a transcription request to a local instance of the MT3 model
   * @param {string} name Name of the file to transcribe
   * @param {string | number} userId User id
   * @param {Buffer<ArrayBufferLike>} fileBuffer File data
   * @returns An object with the filename and request error. If request was
   * successfull request error is undefined
   */
  transcribe = async (name, userId, fileBuffer) => {
    // Create a bare bones record in the DB for later use
    const dbTranscription = await this.createScore(
      `AIT '${name}'`,
      "Unknown artist",
      "Unknown song",
      false,
      [],
      userId
    );

    // Save file to upload directory
    console.log(`${this.logPrefix} Saving upload file...`);
    const id = uuidv4();
    const filename = `${id}_${name}`;
    const path = `${uploadsDir}/${filename}.wav`;
    fs.writeFileSync(path, fileBuffer, { flag: "w" });
    console.log(`${this.logPrefix} Saved upload file`);

    // Send transcription request
    console.log(`${this.logPrefix} Sending transcription request...`);
    let reqError;
    try {
      await axios.post("http://localhost:5000/api/transcribe", {
        filename: filename,
      });
      console.log(`${this.logPrefix} Transcription request completed`);
    } catch (error) {
      reqError = error;
      console.log(`${this.logPrefix} Transcription request error`);
    }

    return {
      initData: dbTranscription,
      filename: filename,
      reqError: reqError,
    };
  };

  /**
   * Parses MIDI file to tabber format data
   * @param {string} pathToMidi Path to the MIDI file
   * @param {string | number} id Id in the DB
   * @param {string} name Name of the score
   * @param {string} artist Artist
   * @param {string} song Song
   * @param {boolean} isPublic True if public
   * @returns Tabber format data
   */
  parseMIDItoScore = (pathToMidi, id, name, artist, song, isPublic) => {
    const converter = new MidiToScoreService(pathToMidi);
    return converter.convert(id, name, artist, song, isPublic);
  };

  /**
   * Checks the readiness of the transcription and returns it if it's ready
   * @param {string} filename File name
   * @returns File path if file exists, undefined otherwise
   */
  getTranscription = (filename) => {
    // Check if transcription file is generated
    const transcriptionPath = `${transcriptionsDir}/${filename}.mid`;
    const uploadPath = `${uploadsDir}/${filename}.wav`;
    if (fs.existsSync(transcriptionPath)) {
      return { transcriptionPath, uploadPath };
    } else {
      return undefined;
    }
  };
}

const scoreService = new ScoreService(db, jwtAuth);
module.exports = { ScoreService, scoreService };
