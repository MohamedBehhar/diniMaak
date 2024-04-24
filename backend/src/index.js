const express = require('express');
const http = require('http');
const tasksRouter = require("./v1/routes/tasksRoutes");
const authRouter = require("./v1/routes/authRoutes");
const usersRouter = require("./v1/routes/usersRoutes");
const citiesRouter = require("./v1/routes/citiesRoutes");
const bodyParser = require("body-parser");
const carpoolingBookingRouter = require("./v1/routes/bookCarpoolingRoutes");
const carpoolingRouter = require("./v1/routes/carpoolingRoutes");
const verifyJWT = require("./middlewares/verifyJWT");
const cors = require('cors');
const { Server } = require("socket.io");

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"]
	}
});

io.on('connection', (socket) => {
	console.log('**************** a user connected ****************');
	socket.emit('new', 'hello from server');
	socket.on('test', (msg) => {
		console.log('**************** user disconnected ****************' + msg);
	});
});

app.use(bodyParser.json());
app.use(cors());
app.use("/api/v1/tasks", tasksRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
// app.use(verifyJWT); // this is a middleware that checks if the user is authorized
app.use("/api/v1/cities", citiesRouter);
app.use("/api/v1/carpooling", carpoolingRouter);
app.use("/api/v1/carpooling", carpoolingBookingRouter);


server.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

module.exports = {
	io,
}