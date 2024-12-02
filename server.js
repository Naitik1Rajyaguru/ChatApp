const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const socketIO = new Server(server);
const PORT = 3000;

const clientMap = {};

// get request endpoint
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Templates", "index.html"));
});

// server event
socketIO.on("connection", (socket) => {
  console.log("user connected");

  // specific client event
  socket.on("setName", (ID) => {
    clientMap[ID] = socket.id;
    console.log(`${ID} is join as ${socket.id}`);
  });

  socket.on("ChatMessage", ({ receiver, msg }) => {
    if (clientMap[receiver]) {
      const receiverSocketId = clientMap[receiver];
      // send to room using server
      socketIO.to(receiverSocketId).emit("ChatMessageFromServer", msg);
    } else {
      console.log("client not connected");
    }
  });

  socket.on("disconnect", () => {
    for (const [id, socketID] of Object.entries(clientMap)) {
      if (socketID === socket.id) {
        delete clientMap[id];
        console.log(`user ${socketID} disconnnected`);
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`server serving on localhost:${PORT}`);
});
