const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { credentials } = require('../db/models');
const { user } = require('../db/models');
const { tab } = require('../db/models');
const { emitRedisEvent } = require("../config/redis.config");

class UserController {
	/** @type {import("express").RequestHandler} */ // Allows intellisense for expressjs code
	async getUser(req, res) {
		const { id } = req.clientPayload;
		try {
			console.log(`Attempting to get data of user '${id}'`);
			let userData = await user.findOne({
				where: {
					id: id,
				}
			});

			console.log('Found user');
			let userBody = {
				id: userData.id,
				username: userData.username,
			};
			// Emit redis event
			const eventMessage = userBody;
			await emitRedisEvent('getUser', eventMessage);
			// Send response
			res.status(StatusCodes.OK).json(userBody);
		} catch (err) {
			const errStr = `Unknown error during getting user: ${err}`;
			console.log(errStr);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errStr);
		}
	}

	/** @type {import("express").RequestHandler} */ // Allows intellisense for expressjs code
	async updateUser(req, res) {
		let { id } = req.clientPayload;
		let { username } = req.body;

		try {
			console.log(`Attempting to update data of user '${id}'`);
			let userData = await user.findOne({
				where: {
					id: id,
				}
			});

			userData.username = username;
			await userData.save();

			console.log('Update successful');
			// Emit redis event
			const eventMessage = {
				id: userData.id,
				username: userData.username,
				name: ''
			};
			await emitRedisEvent('updateUser', eventMessage);
			// Send response
			res.status(StatusCodes.OK).json(userData);
		} catch (err) {
			const errStr = `Unknown error during updating user: ${err}`;
			console.log(errStr);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errStr);
		}
	}

	/** @type {import("express").RequestHandler} */ // Allows intellisense for expressjs code
	async deleteUser(req, res) {
		let { id } = req.clientPayload;
		try {
			console.log(`Attempting to delete user ${id}`);
			let userData = await user.findOne({
				where: {
					id: id,
				}
			});

			console.log('Finding credentials');
			let userCred = await credentials.findOne({
				where: {
					id: userData.credentialId,
				},
				include: user
			});

			const oldUser = {
				id: userCred.user.id,
				username: userCred.user.username
			};
			await userCred.destroy();

			console.log('Delete successful');
			// Emit redis event
			const eventMessage = oldUser;
			await emitRedisEvent('deleteUser', eventMessage);
			// Send response
			res.status(StatusCodes.OK).send();
		} catch (err) {
			// Send unknown error response
			console.log(`Unknown error during deleting user: ${err}`);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Unknown error during deleting user: ${err}` });
		}
	}
}

module.exports = new UserController();