const express = require('express');
const tasksRouter = require("./v1/routes/tasksRoutes");
const authRouter = require("./v1/routes/authRoutes");
const usersRouter = require("./v1/routes/usersRoutes");
const citiesRouter = require("./v1/routes/citiesRoutes");
const bodyParser = require("body-parser");
const carpoolingRouter = require("./v1/routes/carpoolingRoutes");
const cors = require('cors')


const app = express();
const port = process.env.PORT || 3000;



app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1/tasks", tasksRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/cities", citiesRouter);
app.use("/api/v1/carpooling", carpoolingRouter);



app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});



