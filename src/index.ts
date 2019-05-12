import express from "express";
import * as http from "http";
import path from "path";
import socketIo from "socket.io";
import { GAME_EXECUTABLE_FILE } from "./constants";
import { EventQueue } from "./event_queue";
import { GameClient } from "./game_client";
import { GameRoom } from "./game_room";
import { WrappedProcessForker } from "./wrapped_process_forker";

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);
const port = 3000;
// TODO: Create a game room on authenticated user request;

const forker = new WrappedProcessForker();

const room = new GameRoom();
room.setProcessForker(forker);
room.setGameExecutablePath(path.join(__dirname, GAME_EXECUTABLE_FILE));
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
  room.addClient(client);
  room.startGame();
});
