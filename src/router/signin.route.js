const express = require('express');
const router = express.Router();
const loginController = require('../controllers/signin.controller');

router.post('/', loginController.getUser);

module.exports = router;