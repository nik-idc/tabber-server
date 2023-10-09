const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwtAuth = require('../middleware/jwtAuth');
const env = require('../config/env');
const { credentials } = require('../db/models');
const { user } = require('../db/models');
const { tab } = require('../db/models');
const { emitRedisEvent } = require("../config/redis.config");

class SigninController {
	/** @type {import("express").RequestHandler} */ // Allows intellisense for expressjs code
	async signIn(req, res) {
		const { email, password } = req.body;
		try {
			console.log(`Attempting to login with email '${email}'`);
			let hashedPassword = crypto
                .pbkdf2Sync(password, env.hash.secret, env.hash.iterations, env.hash.keyLength, env.hash.algorithm)
                .toString(env.hash.encoding);
			let userCred = await credentials.findOne({
				where: {
					email: email,
					password: hashedPassword
				},
				include: {
					model: user
				}
			});

			// Sign jwt
			console.log('User found, signing jwt');
			let userBody = {
				id: userCred.user.id,
				username: userCred.user.username,
			};
			let token = jwtAuth.sign(userBody);
			console.log(`Succesfully signed in user '${email}'`);
			// Emit redis event
			const eventMessage = {
				id: userCred.user.id,
				email: userCred.email,
				username: userCred.user.username,
			}
			await emitRedisEvent('signin', eventMessage);
			// Send response
			res.status(StatusCodes.OK).json({ data: userBody, token: token });
		} catch (err) {
			const errStr = `Unknown error during signing in: ${err}`
			console.log(errStr);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errStr);
		}
	}
}

module.exports = new SigninController();