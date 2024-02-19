const express = require("express");
const router = express.Router();
const tasksControllers = require("../../controllers/tasksControllers");



router.get("/", tasksControllers.getAllTasks)

router.get("/:id", tasksControllers.getTask)

router.post("/", tasksControllers.createTask)

router.put("/:id", tasksControllers.updateTask)

router.delete("/:id", tasksControllers.deleteTask)

module.exports = router;
