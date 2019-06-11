import cookieSession from "cookie-session";
import express from "express";
import * as http from "http";
import path from "path";
import socketIo from "socket.io";
import v4 from "uuid/v4";
import { GAME_EXECUTABLE_FILE } from "./constants";
import { EventQueue } from "./event_queue";
import { GameClient } from "./game_client";
import { GameRoom } from "./game_room";
import { WrappedProcessForker } from "./wrapped_process_forker";
import { WrappedSocket } from "./wrapped_socket";

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);
const port = 3000;

const cookieSessionOptions = {
  name: "session",
  secret: "CHANGE THIS SECRET",
};

const forker = new WrappedProcessForker();
const room = new GameRoom();
room.setProcessForker(forker);
room.setGameExecutablePath(path.join(__dirname, GAME_EXECUTABLE_FILE));
room.save();

// TODO: Figure out what this means
app.set("trust proxy", 1); // Trust first proxy.
app.use(cookieSession(cookieSessionOptions));

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  if (!req.session.playerId) {
    req.session.playerId = v4();
  }
  res.render("index");
});

app.post("/games", (req, res) => {
  if (!req.session.playerId) {
    res.render("sign_in");
    return;
  }

  // const room = new GameRoom();
  // room.setProcessForker(forker);
  // room.setGameExecutablePath(path.join(__dirname, GAME_EXECUTABLE_FILE));
  // room.save();

  // res.redirect(`/games/${room.getId()}`);
  res.redirect(`/games/1`);
});

app.get("/games/:id", (req, res) => {
  if (!req.session.playerId) {
    res.render("sign_in");
    return;
  }

  // const roomId = req.params.id;
  // const room = GameRoom.find(roomId);
  // if (room) {
  //   res.render("game", { gameId: room.getId() });
  // }

  res.render("game");
});

// start the Express server
httpServer.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});

io.on("connection", (socket) => {
  const wrappedSocket = new WrappedSocket(socket);
  const client = new GameClient(wrappedSocket);
  // tslint:disable-next-line:no-console
  console.log(socket.handshake.headers.cookie);
  // const id = client.requestPlayerId();
  // const roomId = client.requestRoomId();
  // const room = GameRoom.find(roomId);
  // if (room && room.expectingClient(client)) {
  //   room.addClient(client);
  // }
  setTimeout(() => { room.startGame(); }, 1000);
  room.addClient(client);
});
