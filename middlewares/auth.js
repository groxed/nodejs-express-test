require('dotenv').config();
const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
	const token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (!token) {
		return res.status(403).send('you need to be authorized to view this page');
	}
	try {
		const decoded = jwt.verify(token, process.env.TOKEN_KEY);
		req.user = decoded;
	} catch {
		return res.status(403).send('invalid token');
	}
	next();
};

module.exports = validateToken;
