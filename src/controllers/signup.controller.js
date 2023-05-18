const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../db/env');
const { credentials } = require('../db/seq/models');
const { user } = require('../db/seq/models');
const { tab } = require('../db/seq/models');

class SignupController {

	async createUser(req, res) {
		// Log to the console
		console.log('Attempting signing up');

		// Get user data from request body
		let {email, password, username} = req.body;

		try {
			// Hash the password using the salt
			console.log('Hashing password');
			let hashedPassword = crypto.pbkdf2Sync(password, env.secret, 1024, 64, 'sha512').toString('hex');

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

			let userBody = { userData: cred.user, userTabs: [] };

			// Create jwt containing user data
			console.log('User found, signing jwt');
			const token = jwt.sign(userBody, process.env.TABBER_SECRET);
			// Set jwt in cookie
			res.cookie('token', token, {
				httpOnly: true,
			});

			// Send OK as response
			console.log(`Succesfully created a new user with email '${email}'`);
			res.status(StatusCodes.OK).json(userBody);
		} catch (err) {
			// Send error as response
			console.log(`Unknown error during signing up: ${err}`);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: `Unknown error during signing up: ${err}`});
		}
	}
}

module.exports = new SignupController();