const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const env = require('../db/env');

class JwtAuth {
	auth(req, res, next) {
		// Check if the token is present
		if (!req.headers.authorization) {
			return res.status(StatusCodes.UNAUTHORIZED).send('Unauthorized request');
		}
	
		// Get the token
		let token = req.headers.authorization.split(' ')[1];
		if (token === null) {
			return res.status(StatusCodes.UNAUTHORIZED).send('Unauthorized request');
		}
	
		// Verify the token
		let payload = jwt.verify(token, env.jwt.secret);
		if (!payload) {
			return res.status(StatusCodes.UNAUTHORIZED).send('Unauthorized request');
		}
	
		// Add user id to the request
		req.clientPayload = payload;
	
		next();
	}

	sign(userBody) {
		let tokenPayload = { id: userBody.id, username: userBody.username };
		const token = jwt.sign(tokenPayload, env.jwt.secret);
		return token;
	}
}

module.exports = new JwtAuth();