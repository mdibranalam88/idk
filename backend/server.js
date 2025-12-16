const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});


io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});


app.get("/", (req, res) => {
  res.json({ message: "Express + Socket.IO server is running!" });
});


app.post("/send-data", (req, res) => {
  const data = req.body;

  
  io.emit("newData", data);

  res.json({ status: "Message sent to frontend", data });
});


server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});