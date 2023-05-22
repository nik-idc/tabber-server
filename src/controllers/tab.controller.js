const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../db/env');
const { credentials } = require('../db/seq/models');
const { user } = require('../db/seq/models');
const { tab } = require('../db/seq/models');

class TabController {
	async createTab(req, res) {
		// Log to the console
		console.log('Attempting creating tab');

		// Get user data from request body
		const { userId, userTab } = req.body;

		try {
			// Create new tab in the tabs table
			console.log('Creating new tab');
			let newTab = await tab.create({
				artist: userTab.artist,
				song: userTab.song,
				guitar: userTab.guitar,
				bars: userTab.bars,
				userId: userId,
			});

			// Build tab response
			let tabData = {
				id: newTab.id,
				artist: newTab.artist,
				song: newTab.song,
				guitar: newTab.guitar,
				bars: newTab.bars,
			}

			// Send OK as response
			console.log(`Succesfully created a new tab'`);
			res.status(StatusCodes.OK).json(tabData);
		} catch (err) {
			// Send error as response
			console.log(`Unknown error during creating new tab: ${err}`);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Unknown error during creating new tab: ${err}` });
		}
	}

	async updateTab(req, res) {
		// Log to the console
		console.log('Attempting updating tab');

		// Get user data from request body
		const userTab = req.body;

		try {
			// Create new tab in the tabs table
			console.log('Finding tab to update');
			let tabToUpdate = await tab.findOne({
				where: {
					id: userTab.id,
				},
			});
			// Update tab
			tabToUpdate.artist = userTab.artist;
			tabToUpdate.song = userTab.song;
			tabToUpdate.guitar = userTab.guitar;
			tabToUpdate.bars = userTab.bars;
			// Persist changes in the database
			await tabToUpdate.save();

			// Build response body
			let tabData = {
				id: tabToUpdate.id,
				artist: tabToUpdate.artist,
				song: tabToUpdate.song,
				guitar: tabToUpdate.guitar,
				bars: tabToUpdate.bars,
			}

			// Send OK as response
			console.log(`Succesfully updated a tab'`);
			res.status(StatusCodes.OK).json(tabData);
		} catch (err) {
			// Send error as response
			console.log(`Unknown error during updating tab: ${err}`);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Unknown error during updating tab: ${err}` });
		}
	}

	async deleteTab(req, res) {
		// Log to the console
		console.log('Attempting deleting tab');

		// Get user data from request body
		const tabId = req.body.tabId;

		try {
			// Create new tab in the tabs table
			console.log('Finding tab to update');
			let tabToDelete = await tab.findOne({
				where: {
					id: tabId,
				},
			});
			// Delete tab
			await tabToDelete.destroy();

			// Send OK as response
			console.log(`Succesfully deleted a tab'`);
			res.status(StatusCodes.OK).send();
		} catch (err) {
			// Send error as response
			console.log(`Unknown error during deleting tab: ${err}`);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Unknown error during deleting tab: ${err}` });
		}
	}
}

module.exports = new TabController();