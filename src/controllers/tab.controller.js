const { StatusCodes } = require("http-status-codes");
const { matchedData } = require("express-validator");
const { TabService, tabService } = require("./../services/tab.service");

/**
 * Class responsible for handling tab-related HTTP requests
 */
class TabController {
  /**
   * Constructs a new TabController object
   * @param {TabService} tabService Tab service object
   */
  constructor(tabService) {
    this.tabService = tabService;
    this.logPrefix = "Tab Controller:";
  }

  /**
   * Get user tabs endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  getUserTabs = async (req, res) => {
    const { userId } = matchedData(req);

    try {
      console.log(
        `${this.logPrefix} Get user tabs endpoint hit, retrieving tabs...`
      );
      const tabs = await this.tabService.getUserTabs(userId);

      res.status(StatusCodes.OK).json(tabs);
      console.log(`${this.logPrefix} Get user tabs endpoint succesfull`);
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during getting user tabs: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };

  /**
   * Get tab endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  getTab = async (req, res) => {
    const { tabId } = matchedData(req);

    try {
      console.log(`${this.logPrefix} Get tab endpoint hit, retrieving tab...`);
      const tab = await this.tabService.getTab(tabId);

      res.status(StatusCodes.OK).json(tab);
      console.log(`${this.logPrefix} Get tab endpoint succesfull`);
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during getting tab: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };

  /**
   * Create tab endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  createTab = async (req, res) => {
    const { name, artist, song, guitar, data, isPublic, userId } =
      matchedData(req);
    try {
      console.log(`${this.logPrefix} Create tab endpoint hit, creating tab...`);
      const tab = await this.tabService.createTab(
        name,
        artist,
        song,
        guitar,
        data,
        isPublic,
        userId
      );

      console.log(`${this.logPrefix} Create tab endpoint succesfull`);
      res.status(StatusCodes.OK).json(tab);
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during creating tab: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };

  /**
   * Update tab endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  updateTab = async (req, res) => {
    const { tabId, name, artist, song, guitar, data, isPublic } =
      matchedData(req);
    try {
      console.log(`${this.logPrefix} Update tab endpoint hit, updating tab...`);
      const tab = await this.tabService.updateTab(
        tabId,
        name,
        artist,
        song,
        guitar,
        data,
        isPublic
      );

      res.status(StatusCodes.OK).json(tab);
      console.log(`${this.logPrefix} Update tab endpoint succesfull`);
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during updating tab: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };

  /**
   * Delete tab endpoint
   * @param {import("express").Request} req Express request
   * @param {import("express").Response} res Express response
   */
  deleteTab = async (req, res) => {
    const { tabId } = matchedData(req);
    try {
      console.log(`${this.logPrefix} Delete tab endpoint hit, deleting tab...`);
      await this.tabService.deleteTab(tabId);

      res.status(StatusCodes.OK).send();
      console.log(`${this.logPrefix} Delete tab endpoint succesfull`);
    } catch (error) {
      const errorStr = `${this.logPrefix} Unknown error during deleting tab: ${error}`;
      console.log(errorStr);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorStr);
    }
  };
}

const tabController = new TabController(tabService);
module.exports = { TabController, tabController };
