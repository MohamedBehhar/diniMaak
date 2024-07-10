const authServices = require('../services/authServices');


const signUp = async (req, res) => {

	try {
		const { username, password, email, phone_number } = req.body;
		if (await authServices.checkUsernames(username)) {
			return res.status(409).json({ error: { key: 'username', message: 'Username already exists' } });
		}
		if (await authServices.checkEmail(email)) {
			return res.status(409).json({ error: { key: 'email', message: 'Email already exists' } });
		}
		if (await authServices.checkPhone(phone_number)) {
			return res.status(409).json({ error: { key: 'phone_number', message: 'Phone number already exists' } });
		}
		if (!username || !password) {
			return res.status(400).json({ error: 'Missing required fields: username and password' });
		}
		const createdUser = await authServices.signUp({ username, password, email, phone_number });
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
		res.status(200).json({ accessToken: user.token, refresh_token: user.refresh_token, id: user.id, username: user.username })
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const updateToken = async (req, res) => {
	try {
		const { refresh_token } = req.body;

		if (!refresh_token) {
			return res.status(400).json({ error: 'Missing required fields: refresh_token' });
		}

		const user = await authServices.updateToken({ refresh_token });
		if (!user) {



			return res.status(403).json({ error: 'Invalid credentials' });


		}
		res.status(200).json({ accessToken: user.token, refresh_token: user.refresh_token })
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

module.exports = {
	signUp,
	login,
	updateToken,
}

