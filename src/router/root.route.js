const express = require('express');
const router = express.Router();
const rootController = require('../controllers/root.controller');
const jwtAuth = require('../middleware/jwtAuth');

router.get('/', jwtAuth.auth, rootController.getRoot);

module.exports = router;