const express = require('express');
const router = express.Router();
const tabController = require('../controllers/tab.controller');

router.put('/', tabController.createTab);
router.post('/', tabController.updateTab);
router.delete('/', tabController.deleteTab);

module.exports = router;