import bodyParser from "body-parser";
import express from "express";
import * as http from "http";
import path from "path";
import socketIo from "socket.io";
import v4 from "uuid/v4";

import { GAME_EXECUTABLE_FILE, ROLE_TYPE_CHOICE_MAP } from "./constants";
import { EventQueue } from "./event_queue";
import { GameClient } from "./game_client";
import { GameRoom } from "./game_room";
import { WrappedProcessForker } from "./wrapped_process_forker";
import { WrappedSocket } from "./wrapped_socket";

const app = express();
const httpServer = http.createServer(app);
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const io = socketIo(httpServer);
const port = 3000;
// TODO: Create a game room on authenticated user request;

const forker = new WrappedProcessForker();

const room = new GameRoom();
room.setProcessForker(forker);
room.setGameExecutablePath(path.join(__dirname, GAME_EXECUTABLE_FILE));
room.save();

interface ILocalStorageSession {
  id: string;
}

const userSessions: ILocalStorageSession[] = [];

const createSession = (): ILocalStorageSession => {
  const session = { id: v4() };
  userSessions.push(session);
  return session;
};

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const session = createSession();
  // TODO: Encrypt sessionId before sending it accross;
  res.render("index", {
    localSessionId: session.id,
    roleTypes: ROLE_TYPE_CHOICE_MAP
  });
});

app.get("/game", (req, res) => {
  res.render("game");
});

app.post("/search", urlencodedParser, (req, res) => {
  res.redirect("/game");
});

httpServer.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});

io.on("connection", (socket) => {
  const wrappedSocket = new WrappedSocket(socket);
  const client = new GameClient(wrappedSocket);
  room.addClient(client);
  room.startGame();
});
