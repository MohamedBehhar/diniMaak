
const db = require('../db/db');

const getAllTasks = async () => {
	// check if authorized
	// if not authorized, return error
	// if authorized, return tasks


	try {
		const tasks = await db.query('SELECT * FROM tasks');
		return tasks.rows;
	} catch (err) {
		console.error(err);
		throw err; // You might want to throw the error to be caught by the controller
	}
}

const getTask = async (id) => {
	try {
		const task = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
		return task.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const createTask = async ({ title, description, user_id }) => {
	try {
		console.log(title, description, user_id);
		const newTask = await db.query(
			'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
			[title, description, user_id]
		);
		return newTask.rows[0];
	}
	catch (err) {
		throw err;
	}
}

const updateTask = async ({ id, title, description }) => {
	console.log(id, title, description);
	try {
		const updatedTask = await db.query(
			'UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *',
			[title, description, id]
		);
		return updatedTask.rows[0];

	} catch (err) {
		console.error(err);
		throw err;
	}
}

const deleteTask = async (id) => {
	try {
		const deletedTask = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
		return deletedTask.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}

}

module.exports = {
	getAllTasks,
	getTask,
	createTask,
	updateTask,
	deleteTask
}