const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

class JwtAuth {
	cookieJwtAuth(req, res, next) {
		// Get jwt out of the cookie
		const token = req.cookies.token;
	
		try {
			console.log('jwt verif');
	
			// Verify token
			const user = jwt.verify(token, process.env.TABBER_SECRET);
	
			console.log(user, 'test');
	
			// Grab user data from request
			req.user = user;
	
			console.log('jwt verif: success');
		} catch (err) {
			console.log('jwt verif: fail');
	
			// Deleting the cookie
			res.clearCookie('token');
		}
	
		// Proceed to the next middleware function
		next();
	}

	setJwtCookie(req, res, next) {

	}
}

function cookieJwtAuth(req, res, next) {
	// Get jwt out of the cookie
	const token = req.cookies.token;

	try {
		console.log('jwt verif');

		// Verify token
		const user = jwt.verify(token, process.env.TABBER_SECRET);

		console.log(user, 'test');

		// Grab user data from request
		req.user = user;

		console.log('jwt verif: success');
	} catch (err) {
		console.log('jwt verif: fail');

		// Deleting the cookie
		res.clearCookie('token');
	}

	// Proceed to the next middleware function
	next();
}

module.exports = cookieJwtAuth;