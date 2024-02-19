const tasksServices = require('../services/tasksServices');

const getAllTasks = async (req, res) => {
	try {
		const tasks = await tasksServices.getAllTasks();
		res.send(tasks);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const getTask = async (req, res) => {
	try {
		const task = await tasksServices.getTask(req.params.id);
		if (!task) {
			return res.status(404).json({ error: 'Task not found' });
		}
		res.send(task);
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const createTask = async (req, res) => {
	try {
		const { title, description, user_id } = req.body;
		if (!title || !description) {
			return res.status(400).json({ error: 'Missing required fields: title and description' });
		}
		const createdTask = await tasksServices.createTask({ title, description, user_id });
		res.status(201).json(createdTask);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const updateTask = async (req, res) => {
	try {
		const { title, description } = req.body;
		if (!title || !description) {
			return res.status(400).json({ error: 'Missing required fields: title and description' });
		}
		const updatedTask = await tasksServices.updateTask({ id: req.params.id, title, description });
		if (!updatedTask) {
			return res.status(404).json({ error: 'Task not found' });
		}
		res.send(updatedTask);
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const deleteTask = async (req, res) => {
	try {
		const deletedTask = await tasksServices.deleteTask(req.params.id);
		if (!deletedTask) {
			return res.status(404).json({ error: 'Task not found' });
		}
		res.send(deletedTask);
	}
	catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

module.exports = {
	getAllTasks,
	getTask,
	createTask,
	updateTask,
	deleteTask
}