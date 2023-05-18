class UserController {

	async redirectToLogin(req, res) {
		res.redirect('/api/login');
	}

	// Update user info
	async updateUser(req, res) {

	}

	// Get user info
	async getUser(req, res) {

	}

	// Delete user
	async deleteUser(req, res) {

	}
}

module.exports = new UserController();