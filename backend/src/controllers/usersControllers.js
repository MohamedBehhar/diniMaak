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

module.exports = {
	getUsers,
	isAuthorized,
}