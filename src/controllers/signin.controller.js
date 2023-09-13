const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwtAuth = require('../middleware/jwtAuth');
const env = require('../config/env');
const { credentials } = require('../db/models');
const { user } = require('../db/models');
const { tab } = require('../db/models');

class LoginController {
	async signIn(req, res) {
		// Get user data from request body
		let { email, password } = req.body;

		try {
			// Log attempting to login
			console.log(`Attempting to login with email ${email}`);

			// Find user with specified email and password in the database
			let hashedPassword = crypto
                .pbkdf2Sync(password, env.hash.secret, env.hash.iterations, env.hash.keyLength, env.hash.algorithm)
                .toString(env.hash.encoding);

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

			// Build user object
			let userBody = {
				id: userCred.user.id,
				username: userCred.user.username,
				tabs: userCred.user.tabs,
			};

			// Create and sign jwt containing user data
			console.log('User found, signing jwt');
			let jwttoken = jwtAuth.sign(userBody);

			// Build response body
			let responseBody = { data: userBody, token: jwttoken };

			// Send OK response and token in the cookie
			console.log('Login successful');
			res.status(StatusCodes.OK).json(responseBody);
		} catch (err) {
			// Send unknown error response
			console.log(`Unknown error during signing in: ${err}`);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Unknown error during signing in: ${err}` });
		}
	}

	async signOut(req, res) {

	}
}

module.exports = new LoginController();