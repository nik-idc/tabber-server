const fs = require("fs");

/**
 * Utilities service
 */
class UtilService {
  /**
   * Utilities service
   */
  constructor() {
    this.logPrefix = "Util Service:";
  }

  /**
   * Deletes file using 'fs.rmSync'
   * @param {string} path Path to the file
   */
  deleteFile = (path) => {
    fs.rmSync(path);
  };

  /**
   * Generates random integer
   * @param {number} min Min
   * @param {number} max Max
   * @returns Random integer
   */
  randomInt = (min, max) => {
    if (min === undefined) {
      min = 0;
    }
    if (max === undefined) {
      max = Number.MAX_SAFE_INTEGER;
    }

    min = Math.floor(min);
    max = Math.floor(max);

    return min + Math.floor(Math.random() * (max - min + 1));
  };
}

const utilService = new UtilService();
module.exports = { UtilService, utilService };
