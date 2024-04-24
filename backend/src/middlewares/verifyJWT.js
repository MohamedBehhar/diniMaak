const jwt = require('jsonwebtoken');


const verifyJWT = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
			if (err) {
				if (err.name === 'TokenExpiredError') {
					return res.status(401).json({ error: 'Invalid token' });
				}
				return res.status(403).json({ error: 'Token expired' });
			}
			req.user = decode.username;
			next();
		});
	} else {
		res.sendStatus(401);
	}
}

module.exports = verifyJWT;