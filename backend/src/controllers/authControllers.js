const authServices = require('../services/authServices');


const register = async (req, res) => {
	const user = await authServices.getUserByUsername(req.body.username);
	if (user) {
		res.status(409).json({ error: 'Username already exists' });
		return;
	}

	try {
		const { username, password } = req.body;
		if (!username || !password) {
			return res.status(400).json({ error: 'Missing required fields: username and password' });
		}
		const createdUser = await authServices.register({ username, password });
		res.status(201).json(createdUser);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });

	}
}

const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({ error: 'Missing required fields: username and password' });
		}
		const user = await authServices.login({ username, password });
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		res.status(200).json({ accessToken: user.token, refreshToken: user.refreshToken, id: user.id, username: user.username })
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const updateToken = async (req, res) => {
	try {
		const { refreshToken } = req.body;

		if (!refreshToken) {
			return res.status(400).json({ error: 'Missing required fields: refreshToken' });
		}

		const user = await authServices.updateToken({ refreshToken });
		if (!user) {



			return res.status(403).json({ error: 'Invalid credentials' });


		}
		res.status(200).json({ accessToken: user.token, refreshToken: user.refreshToken })
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

module.exports = {
	register,
	login,
	updateToken,
}

