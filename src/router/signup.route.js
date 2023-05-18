const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signup.controller');

router.put('/', signupController.createUser);

module.exports = router;