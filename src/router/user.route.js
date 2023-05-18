const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const jwtAuth = require('./../middleware/jwtAuth');

// router.get('/', jwtAuth);
router.post('/', userController.updateUser);
router.delete('/', userController.deleteUser);

module.exports = router;