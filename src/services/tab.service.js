const { DB, db } = require("./../db/db");
const { JwtAuth, jwtAuth } = require("./../middleware/jwtAuth");

/**
 * Class responsible fir tab-related business logic
 */
class TabService {
  /**
   * Constructs a new TabService object
   * @param {DB} db Database
   * @param {JwtAuth} jwtAuth JwtAuth
   */
  constructor(db, jwtAuth) {
    this.db = db;
    this.jwtAuth = jwtAuth;
    this.logPrefix = "Tab Service:";
  }

  /**
   * Retrieves tab
   * @param {string | number} tabId Tab id
   * @returns Tab
   */
  getTab = async (tabId) => {
    console.log(`${this.logPrefix} Getting tab '${tabId}'...`);
    const tab = await this.db.models.Tab.findByPk(tabId);
    console.log(`${this.logPrefix} Retrieved tab '${tabId}'`);

    return tab;
  };

  /**
   * Creates tab
   * @param {string} name Tab name
   * @param {string} artist Artist
   * @param {string} song Song
   * @param {Object | string} guitar Guitar
   * @param {Object | string} data Entire tab as JSON object
   * @param {boolean} isPublic If tab is public
   * @param {string | number} userId User id
   * @returns Created tab
   */
  createTab = async (name, artist, song, guitar, bars, isPublic, userId) => {
    console.log(`${this.logPrefix} Creating tab...`);
    const tab = await this.db.models.Tab.create({
      name: name,
      artist: artist,
      song: song,
      guitar: guitar,
      data: bars,
      isPublic: isPublic,
      userId: userId,
    });
    console.log(`${this.logPrefix} Created tab`);

    return tab;
  };

  /**
   * Updates tab
   * @param {string | number} tabId Tab id
   * @param {string} artist Artist
   * @param {string} song Song
   * @param {Object | string} guitar Guitar
   * @param {Object | string} data Entire tab as JSON object
   * @param {boolean} isPublic Is tab isPublic
   * @returns Updated tab
   */
  updateTab = async (tabId, artist, song, guitar, data, isPublic) => {
    console.log(`${this.logPrefix} Updating tab...`);
    const tab = await this.db.models.Tab.update(
      {
        artist: artist,
        song: song,
        guitar: guitar,
        data: data,
        isPublic: isPublic,
      },
      {
        where: {
          id: tabId,
        },
      }
    );
    console.log(`${this.logPrefix} Updated tab`);

    return tab;
  };

  /**
   * Deletes tab
   * @param {string | number} tabId Tab id
   */
  deleteTab = async (tabId) => {
    console.log(`${this.logPrefix} Deleting tab...`);
    await this.db.models.Tab.destroy({
      where: {
        id: tabId,
      },
    });
    console.log(`${this.logPrefix} Deleted tab`);
  };
}

const tabService = new TabService(db, jwtAuth);
module.exports = { TabService, tabService };
