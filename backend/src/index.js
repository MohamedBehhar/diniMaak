const express = require('express');
const tasksRouter = require("./v1/routes/tasksRoutes");
const authRouter = require("./v1/routes/authRoutes");
const usersRouter = require("./v1/routes/usersRoutes");

const bodyParser = require("body-parser");
const cors = require('cors')


const app = express();
const port = 3000 || process.env.PORT;



app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1/tasks", tasksRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);



app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});



