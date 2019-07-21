import bodyParser from "body-parser";
import connectRedis = require("connect-redis");
import express from "express";
import session from "express-session";
import sharedSession from "express-socket.io-session";
import * as http from "http";
import path from "path";
import redis from "redis";
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
// TODO Provide the configuration of the redis client
const redisClient = redis.createClient();
const RedisStore = connectRedis(session);
const sessionMiddleWare = session({
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: true,
  secret: "MAKE THIS AN ENV VARIABLE",
  store: new RedisStore({client: redisClient})
});

const forker = new WrappedProcessForker();

const room = new GameRoom();
room.setProcessForker(forker);
room.setGameExecutablePath(path.join(__dirname, GAME_EXECUTABLE_FILE));
room.save();

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(sessionMiddleWare);

app.get("/", (req, res) => {
  res.render("index", { roleTypes: ROLE_TYPE_CHOICE_MAP });
});

app.post("/search", urlencodedParser, (req, res) => {
  res.redirect("/game");
});

app.get("/game", (req, res) => {
  res.render("game");
});

httpServer.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});

io.use(sharedSession(sessionMiddleWare, { autoSave: true }));
io.on("connection", (socket) => {
  const wrappedSocket = new WrappedSocket(socket);
  const client = new GameClient(wrappedSocket);
  room.addClient(client);
  room.startGame();
});
