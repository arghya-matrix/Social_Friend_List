const express = require("express");
const server = express();
const port = 3000;
const userRouter = require("./router/user.router");
const path = require("path");
const { Server } = require("socket.io");
const { createServer } = require('node:http');
const app = createServer(server);
const io = new Server(app);

server.use((req, res, next) => {
  console.log(`Method : ${req.method}, ip : ${req.ip}, path : ${req.path}`);
  next();
});

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/user", userRouter);
server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.listen(port, () => {
  console.log(`server started at ${port}`);
});
