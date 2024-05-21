const usersServices = require('../services/usersServices');
const authServices = require('../services/authServices');

const isAuthorized = async (req, res, next) => {
	try {
		if (!req.headers.authorization) {
			return false;
		}
		const token = req.headers.authorization.split(' ')[1];
		const isAuthorized = await authServices.isAuthorized(token);
		if (isAuthorized == true) {
			return true
		}
		return false;
	} catch (error) {
		return error;
	}
}

const getUsers = async (req, res, next) => {
	try {
		// const authorized = await isAuthorized(req, res, next);
		// console.log(authorized);
		// if (!authorized) {

		// 	return res.status(401).json({ error: 'Unauthorized' });

		// }
		const users = await usersServices.getUsers();
		res.send(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const getUserInfo = async (req, res, next) => {
	try {
		const user_id = req.params.user_id;
		const user = await usersServices.getUserInfo(user_id);
		res.send(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const updateUserInfo = async (req, res, next) => {
	try {
		const user = {
			id: req.body.id,
			username: req.body.username,
			phone_number: req.body.phone_number,
			email: req.body.email,
			profile_picture: req.file ? `/public/${req.file.filename}` : null,
		}
		const updatedUser = await usersServices.updateUserInfo(user);
		res.send(updatedUser);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

module.exports = {
	getUsers,
	isAuthorized,
	getUserInfo,
	updateUserInfo,
}