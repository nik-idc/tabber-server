const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwtAuth = require('../middleware/jwtAuth');
const env = require('../db/env');
const { credentials } = require('../db/seq/models');
const { user } = require('../db/seq/models');
const { tab } = require('../db/seq/models');

class SignupController {
	async createUser(req, res) {
		// Log to the console
		console.log('Attempting signing up');

		// Get user data from request body
		let { email, password, username } = req.body;

		try {
			// Hash the password using the salt
			console.log('Hashing password');
			let hashedPassword = crypto
                .pbkdf2Sync(password, env.hash.secret, env.hash.iterations, env.hash.keyLength, env.hash.algorithm)
                .toString(env.hash.encoding);

			// Create credentials
			console.log('Creating credentials and user');
			let cred = await credentials.create({
				email: email,
				password: hashedPassword,
				user: {
					username: username
				}
			}, {
				include: [user]
			});

			// Build user object
			let userBody = {
				id: cred.user.id,
				username: cred.user.username,
				tabs: []
			};
			
			// Create jwt containing user data
			console.log('User found, signing jwt');
			let jwttoken = jwtAuth.sign(userBody);

			// Build response body
			let responseBody = { data: userBody, token: jwttoken };
			
			// Send OK as response
			console.log(`Succesfully created a new user with email '${email}'`);
			res.status(StatusCodes.OK).json(responseBody);
		} catch (err) {
			// Send error as response
			console.log(`Unknown error during signing up: ${err}`);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Unknown error during signing up: ${err}` });
		}
	}
}

module.exports = new SignupController();