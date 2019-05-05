import express from "express";
import * as http from "http";
import path from "path";
import socketIo from "socket.io";
import { GameProcessManager } from "./game_process_manager";
import { SocketConfiguration } from "./socket_configuration";
let lastGameId = 0;

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);
const port = 3000;

const gameProcessManager = new GameProcessManager(io);
const socketConfiguration = new SocketConfiguration(gameProcessManager);

// Configure Express to use EJS
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/games/create", (req, res) => {
  lastGameId += 1;
  res.send({err: 0, redirectUrl: `/games/${lastGameId}`});
});

app.get("/games/:id", (req, res) => {
  res.render("game");
});

// start the Express server
httpServer.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});

io.on("connection", (socket) => {
  socketConfiguration.applyTo(socket);
});
