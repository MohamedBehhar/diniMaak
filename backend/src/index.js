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
const {initializeSocket} = require('./initSocket'); // Import the initializeSocket function

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server); // Use initializeSocket function to initialize io
const port = 3000;



global.io = io; // Make io global


app.use(bodyParser.urlencoded({ extended: true }));



app.use(bodyParser.json());
app.use(cors());
app.use("/api/v1/tasks", tasksRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use(verifyJWT); // this is a middleware that checks if the user is authorized
app.use("/api/v1/cities", citiesRouter);
app.use("/api/v1/carpooling", carpoolingRouter);
app.use("/api/v1/carpooling", carpoolingBookingRouter);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = { app, server, io }; // Export app, server, and io
