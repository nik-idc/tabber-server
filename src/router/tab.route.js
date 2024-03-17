const {
  TabValidator,
  tabValidator,
} = require("./../validators/tab.validate");
const { JwtAuth, jwtAuth } = require("./../middleware/jwtAuth");
const {
  TabController,
  tabController,
} = require("./../controllers/tab.controller");

/**
 * Class responsible for handling tab-related HTTP routes
 */
class TabRouter {
  /**
   * Constructs a new TabRouter object
   * @param {TabValidator} tabValidator Tab validator
   * @param {JwtAuth} jwtAuth JWT auth
   * @param {TabController} tabController Tab controller
   */
  constructor(tabValidator, jwtAuth, tabController) {
    this.tabValidator = tabValidator;
    this.jwtAuth = jwtAuth;
    this.tabController = tabController;
  }

  /**
   * Sets up tab router
   * @param {import("express").Application} app Express app
   */
  setup = (app) => {
    app.get(
      "/api/tab/:tabId",
      this.tabValidator.getTab,
      this.jwtAuth.auth,
      this.tabController.getTab
    );

    app.post(
      "/api/tab",
      this.tabValidator.createTab,
      this.jwtAuth.auth,
      this.tabController.createTab
    );

    app.put(
      "/api/tab/:tabId",
      this.tabValidator.updateTab,
      this.jwtAuth.auth,
      this.tabController.updateTab
    );

    app.delete(
      "/api/tab/:tabId",
      this.tabValidator.deleteTab,
      this.jwtAuth.auth,
      this.tabController.deleteTab
    );
  };
}

const tabRouter = new TabRouter(tabValidator, jwtAuth, tabController);
module.exports = { TabRouter, tabRouter };
