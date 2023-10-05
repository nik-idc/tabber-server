const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwtAuth = require('../middleware/jwtAuth');
const env = require('../config/env');
const { credentials } = require('../db/models');
const { user } = require('../db/models');
const { tab } = require('../db/models');

class SignupController {
	async signup(req, res) {
		let { email, password, username } = req.body;
		
		try {
			console.log('Attempting signing up');
			console.log('Hashing password...');
			let hashedPassword = crypto
                .pbkdf2Sync(password, env.hash.secret, env.hash.iterations, env.hash.keyLength, env.hash.algorithm)
                .toString(env.hash.encoding);

			console.log('Creating credentials and user...');
			let userCred = await credentials.create({
				email: email,
				password: hashedPassword,
				user: {
					username: username
				}
			}, {
				include: user
			});
			
			console.log('User created, signing jwt...')
			let userBody = {
				id: userCred.user.id,
				username: userCred.user.username,
			};
			let token = jwtAuth.sign(userBody);
			console.log(`Succesfully created a new user with email '${email}'`);
			res.status(StatusCodes.OK).json({ data: userBody, token: token });
		} catch (err) {
			const errStr = `Unknown error during signing up: ${err}`;
			console.log(errStr);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errStr);
		}
	}
}

module.exports = new SignupController();