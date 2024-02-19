const db = require('../db/db');
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const getUserByUsername = async (username) => {
	try {
		const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);
		return user.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const isAuthorized = async (token) => {
	try {
		jwt.verify(token, process.env.JWT_SECRET);
		return true;

	} catch (err) {
		return err;
	}
};



const register = async ({ username, password }, res) => {

	try {
		// hash password
		const salt = await bcrypt.genSalt(10);

		const hashedPassword = await bcrypt.hash(password, salt);
		const newUser = await db.query(
			'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
			[username, hashedPassword]
		).then((result) => {
			const maxAge = 5 * 60;
			const refreshTokenMaxAge = 24 * 60 * 60;
			console.log(result.rows[0]);
			console.log(process.env.JWT_SECRET);
			const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, {
				expiresIn: maxAge
			});
			const refreshToken = jwt.sign({ id: result.rows[0].id }, process.env.REFRESH_SECRET, {
				expiresIn: refreshTokenMaxAge
			});

			// add refresh token to db in users table
			if (result.rows[0].refresh_token == null) {
				// hash refresh token
				const hashedRefreshToken = bcrypt.hash(refreshToken, salt);
				db.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, result.rows[0].id]);
			}

			return { ...result.rows[0], token, refreshToken };
		});

		return newUser;
	}
	catch (err) {
		throw err;
	}
}

const login = async ({ username, password }) => {

	try {
		// compare password
		const salt = await bcrypt.genSalt(10);
		const user = await getUserByUsername(username);

		if (!user) {
			return null;
		}
		else {
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return null;
			}
			const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
				expiresIn: 5 * 60
			});
			const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, {
				expiresIn: 5 * 60
			});

			hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
			// replace refresh token in db
			db.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

			return { ...user, token, refreshToken };
		}
	}
	catch (err) {
		throw err;
	}
}

const generateToken = (id, expiresIn) => jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn });

const logout = async (id) => {
	try {
		await db.query('UPDATE users SET refresh_token = null WHERE id = $1', [id]);
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const updateToken = async ({ refreshToken, username }) => {
	try {
		const user = await getUserByUsername(username);
		if (!user)
			return null;

		// verify refresh token
		try {
			jwt.verify(refreshToken, process.env.REFRESH_SECRET);
		}
		catch (err) {
			if (err.name === 'TokenExpiredError') {
				logout(user.id);
			}
			return null;
		}



		if (refreshToken !== user.refresh_token)
			return null

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: 5 * 60
		});
		const newRefreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, {
			expiresIn: 5 * 60
		});

		const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
		await db.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [newRefreshToken, user.id]);

		return { ...user, token, refreshToken: newRefreshToken };
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
};




module.exports = {
	register,
	getUserByUsername,
	login,
	isAuthorized,
	updateToken,
}