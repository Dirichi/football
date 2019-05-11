import express from "express";
import * as http from "http";
import path from "path";
import socketIo from "socket.io";
import { GameClient } from "./game_client";
import { GameProcessManager } from "./game_process";
import { GameRoom } from "./game_room";

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);
const port = 3000;
// TODO: Create a game room on authenticated user request;
const room = new GameRoom();
const processManager = new GameProcessManager();
room.save();

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

// start the Express server
httpServer.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});

io.on("connection", (socket) => {

  const client = new GameClient(socket);
  client.configureListeners();
  room.addClient(client);

  processManager.manageProcessesFor(room);
});
