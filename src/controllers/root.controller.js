class RootController {
	getRoot(req, res) {
		if (req.user) {
			console.log('redirecting to "user"');
			res.redirect('/user');
		} else {
			console.log('redirecting to "login"');
			res.redirect('/login');
		}
	}
}

module.exports = new RootController();