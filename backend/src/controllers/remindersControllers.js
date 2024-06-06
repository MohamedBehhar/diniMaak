const remindersServices = require('../services/remindersServices');

const setReminder = async (req, res) => {
	const { user_id, destination, departure } = req.body;
	try {
		const reminder = await remindersServices.setReminder({ user_id, destination, departure });
		res.status(200).json(reminder);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
}

module.exports = {
	setReminder
}