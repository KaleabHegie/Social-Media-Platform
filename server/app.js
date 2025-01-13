const express = require('express');
const { errorHandler } = require('./Middleware/errorHandler');
const connectDB = require('./Config/dbConn');
const cors = require('cors');
const http = require('http'); // Import HTTP module
// const { Server } = require('socket.io'); // Import Socket.IO

const userAccountRoutes = require('./Routes/userAccountRoutes');
const appRoutes = require('./Routes/appRoutes');
const socketController = require('./Controllers/socketController'); // Socket.IO controller

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDB();
const port = process.env.PORT || 5000;
app.use(errorHandler);

app.get(["/", "/ping"], async (req, res) => {
  res.json({ status: "Server Active" });
});

app.use("/api", userAccountRoutes);
app.use("/api", appRoutes);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ' http://localhost:5173/', // Replace with your frontend URL in production
//     methods: ['GET', 'POST'],
//   },
// });

// // Initialize Socket.IO controller
// socketController(io);

// Start the server
server.listen(port, () => {
  console.log(`Social-Media-App-Api listening at http://localhost:${port}`);
});
