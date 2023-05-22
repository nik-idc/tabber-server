const express = require('express');
const router = express.Router();
const tabController = require('../controllers/tab.controller');
const jwtAuth = require('../middleware/jwtAuth');

router.post('/', jwtAuth.auth, tabController.createTab);
router.put('/', jwtAuth.auth, tabController.updateTab);
router.delete('/', jwtAuth.auth, tabController.deleteTab);

module.exports = router;