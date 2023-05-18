const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../db/env');
const { credentials } = require('../db/seq/models');
const { user } = require('../db/seq/models');
const { tab } = require('../db/seq/models');

class LoginController {
	async getUser(req, res) {
		// Get user data from request body
		let { email, password } = req.body;

		try {
			// Log attempting to login
			console.log(`Attempting to login with email ${email}`);

			// Find user with specified email and password in the database
			let hashedPassword = crypto.pbkdf2Sync(password, env.secret, 1024, 64, 'sha512').toString('hex');

			// Find user based on credentials
			console.log('Finding user based on credentials');
			let userCred = await credentials.findOne({
				where: {
					email: email,
					password: hashedPassword
				},
				include: [{
					model: user,
					include: [tab]
				}]
			});

			// Create user body for response
			let userBody = {
				id: userCred.user.id,
				username: userCred.user.username,
				tabs: userCred.user.tabs,
			};

			// Create and sign jwt containing user data
			console.log('User found, signing jwt');
			const token = jwt.sign(userBody, process.env.TABBER_SECRET);
			res.cookie('token', token, {
				httpOnly: true,
				expiresIn: '30d'
			});

			// Send OK response and token in the cookie
			console.log('Login successful');
			res.status(StatusCodes.OK).json(userBody);
		} catch (err) {
			// Send unknown error response
			console.log(`Unknown error during sign in: ${err}`);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Unknown error during sign in: ${err}` });
		}
	}
}

module.exports = new LoginController();