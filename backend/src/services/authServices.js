const db = require('../db/db');
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

// 1 minute
const accessTokenMaxAge = 1 * 30;
// two days
const refresh_tokenMaxAge = 2 * 24 * 60 * 60;

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

const checkUsernames = async (username) => {
	try {
		const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);
		return user.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const checkEmail = async (email) => {
	try {
		const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
		return user.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const signUp = async ({ username, password, email, phone_number }, res) => {

	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		console.log('hashedPassword ', username + ' ' + hashedPassword + ' ' + email + ' ' + phone_number);
		const newUser = await db.query(
			'INSERT INTO users (username, password, email, phone_number) VALUES ($1, $2, $3, $4 ) RETURNING *',
			[username, hashedPassword, email, phone_number]
		).then((result) => {

			console.log(process.env.JWT_SECRET);
			const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, {
				expiresIn: accessTokenMaxAge
			});
			const refresh_token = jwt.sign({ id: result.rows[0].id }, process.env.REFRESH_SECRET, {
				expiresIn: refresh_tokenMaxAge
			});

			// add refresh token to db in users table
			if (result.rows[0].refresh_token == null) {
				// hash refresh token
				const hashedrefresh_token = bcrypt.hash(refresh_token, salt);
				db.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refresh_token, result.rows[0].id]);
			}

			return { ...result.rows[0], token, refresh_token };
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
			console.log("isMatch ", isMatch);
			if (!isMatch) {
				return null;
			}
			const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
				// one minute
				expiresIn: accessTokenMaxAge
			});
			const refresh_token = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, {
				expiresIn: refresh_tokenMaxAge
			});

			hashedrefresh_token = await bcrypt.hash(refresh_token, salt);
			// replace refresh token in db
			console.log('user id333 ', user.id);
			await db.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refresh_token, user.id]);

			return { ...user, token, refresh_token };
		}
	}
	catch (err) {
		throw err;
	}
}

const generateToken = (id, expiresIn) => jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn });

const logout = async (id) => {
	try {
		console.log('id ', id);
		const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
		await db.query('UPDATE users SET refresh_token = null WHERE id = $1', [id]);
		console.log('uuuuuu ', user.rows[0]);
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const updateToken = async ({ refresh_token }) => {
	try {
		// verify refresh token

		let user = await db.query('SELECT * FROM users WHERE refresh_token = $1', [refresh_token]);
		if (!user.rows[0]) {
			console.log('no user found');
			return null;
		}

		try {
			jwt.verify(refresh_token, process.env.REFRESH_SECRET);
		}
		catch (err) {
			if (err.name === 'TokenExpiredError') {
				console.log('refresh token expired');
				// remove refresh token from db
				console.log('---- ', user.rows[0].id);
				logout(user.rows[0].id);

				return null;
			}
			return null;
		}



		if (refresh_token !== user.rows[0].refresh_token) {
			console.log('refresh token not in db');
			logout(user.id);
			return null
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: accessTokenMaxAge
		});
		const newrefresh_token = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, {
			expiresIn: refresh_tokenMaxAge
		});

		const hashedrefresh_token = await bcrypt.hash(newrefresh_token, 10);
		await db.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [newrefresh_token, user.id]);

		return { ...user, token, refresh_token: newrefresh_token };
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
};




module.exports = {
	signUp,
	getUserByUsername,
	login,
	isAuthorized,
	updateToken,
	checkUsernames,
	checkEmail
}