const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const socketio = require("socket.io");
const http = require("http");

const routes = require("./routes");

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect(
  "mongodb://feruffo:8556@cluster0-shard-00-00-drarj.mongodb.net:27017,cluster0-shard-00-01-drarj.mongodb.net:27017,cluster0-shard-00-02-drarj.mongodb.net:27017/omni9?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const connectUsers = {};

io.on("connection", socket => {
  const { user_id } = socket.handshake.query;

  connectUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
  req.io = io;
  req.connectUsers = connectUsers;

  return next();
});

//GET, POST, PUT, DELETE

// req.query = Acessar query params (para filtros)
// req.params = Acessar route params (para edição, delete)
// req.body = Acessar corpo da requisição (para criação, edição)

app.use(cors());
app.use(express.json());
app.use("/files", express.static(path.resolve(__dirname, "..", "uploads")));
app.use(routes);

server.listen(3333);
