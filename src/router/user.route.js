const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const jwtAuth = require('../middleware/jwtAuth');

router.get('/', jwtAuth.auth, userController.getUser);
router.put('/', jwtAuth.auth, userController.updateUser);
router.delete('/', jwtAuth.auth, userController.deleteUser);

module.exports = router;