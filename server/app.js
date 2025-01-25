const express = require("express");
const { errorHandler } = require("./Middleware/errorHandler");
const connectDB = require("./Config/dbConn");
const cors = require("cors");
const http = require("http"); // Import HTTP module
const { Server } = require("socket.io"); // Import Socket.IO
const Message = require("./Models/MessageModel");

const userAccountRoutes = require("./Routes/userAccountRoutes");
const appRoutes = require("./Routes/appRoutes");
const adminRoutes = require("./Routes/adminRoutes");

const socketController = require("./Controllers/socketController"); // Socket.IO controller

const { ObjectId } = require("mongodb");

require("dotenv").config();

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
app.use("/api", adminRoutes);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend URL in production
    methods: ["GET", "POST"],
  },
});

// Initialize Socket.IO controller
// socketController(io);

let socketConnected = new Set();

const findRoomId = async (data) => {
  try {
    const chats = await Message.findById(data.selectedChat)
      .populate("messages.sender", "username profilePhoto") // Populate sender details
      .select("messages participants"); // Select required field

    return chats?._id.toString();
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

io.on("connection", async (socket) => {

  socket.on("room_id", (data) => {
    const roomId = data?.data?.selectedChatId?.selectedChat;
    if (roomId) {
      socket.join(roomId);
    } else {
      console.error("Invalid room_id data received:", data);
    }
  });

  io.emit("client-total", socketConnected.size);

  socket.on("disconnect", () => {
    socketConnected.delete(socket.id);
    io.emit("client-total", socketConnected.size);
  });

  socket.on("send-message", async (data) => {

    

  
    const response = await Message.findById(data.selectedChatId.selectedChat).exec();
    
    

    const messageId = new ObjectId();
    const messageData = {
      _id: messageId,
      sender: data.sender._id,
      content: data.content,
      media: null,
    };

    response.messages.push(messageData);

    await response.save();

    console.log(data.selectedChatId.selectedChat)
    socket.to(data.selectedChatId.selectedChat).emit("recive-message", {
      messageId,
      content: data.content,
      sender: data.sender,
    });
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Social-Media-App-Api listening at http://localhost:${port}`);
});
