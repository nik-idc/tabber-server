const express = require('express');
const router = express.Router();
const loginController = require('../controllers/signin.controller');

router.post('/', loginController.signIn);
router.delete('/', loginController.signOut);

module.exports = router;