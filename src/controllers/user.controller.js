const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../db/env');
const { credentials } = require('../db/seq/models');
const { user } = require('../db/seq/models');
const { tab } = require('../db/seq/models');

class UserController {
	async getUser(req, res) {
		let { id } = req.clientPayload;

		try {
			console.log(`Attempting to get data of user ${id}`);

			// Find user based on credentials
			console.log('Finding user based on id');
			let userData = await user.findOne({
				where: {
					id: id,
				},
				include: [tab]
			});

			// Build user object
			let userBody = {
				id: userData.id,
				username: userData.username,
				tabs: userData.tabs,
			};

			// Send OK response and token in the cookie
			console.log('Update successful');
			res.status(StatusCodes.OK).json(userBody);
		} catch (err) {
			// Send unknown error response
			console.log(`Unknown error during updating user: ${err}`);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Unknown error during updating user: ${err}` });
		}
	}

	async updateUser(req, res) {
		let { id } = req.clientPayload;
		let sentUserData = req.body;

		try {
			console.log(`Attempting to update data of user ${id}`);

			// Find user based on credentials
			console.log('Finding user based on id');
			let userData = await user.findOne({
				where: {
					id: id,
				}
			});

			// Update instance name and save
			userData.username = sentUserData.username;
			await userData.save();

			// Send OK response and token in the cookie
			console.log('Update successful');
			res.status(StatusCodes.OK).send();
		} catch (err) {
			// Send unknown error response
			console.log(`Unknown error during updating user: ${err}`);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Unknown error during updating user: ${err}` });
		}
	}

	async deleteUser(req, res) {
		let { id } = req.clientPayload;

		try {
			console.log(`Attempting to delete user ${id}`);

			// Find user based on credentials
			console.log('Finding user based on id');
			let userData = await user.findOne({
				where: {
					id: id,
				}
			});

			// Find credentials
			console.log('Finding credentials');
			let userCred = await credentials.findOne({
				where: {
					id: userData.credentialId,
				}
			});

			// Update instance name and save
			await userCred.destroy();

			// Send OK response and token in the cookie
			console.log('Delete successful');
			res.status(StatusCodes.OK).send();
		} catch (err) {
			// Send unknown error response
			console.log(`Unknown error during deleting user: ${err}`);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Unknown error during deleting user: ${err}` });
		}
	}
}

module.exports = new UserController();