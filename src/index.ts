import bodyParser from "body-parser";
import connectRedis = require("connect-redis");
import dotenv from "dotenv";
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
import { ICustomizedRequest } from "./interfaces/icustomized_request";
import { ICustomizedSocket } from "./interfaces/icustomized_socket";
import { User } from "./models/user";
import {
  authenticateRequest,
  authenticateSocket,
  authorizeParticipation,
  login,
  requiresLogin
} from "./server_services/auth";
import { MatchMakerService } from "./server_services/match_maker_service";
import { WrappedSocket } from "./wrapped_socket";

dotenv.config();
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

const matchMaker = new MatchMakerService();
// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(sessionMiddleWare);

app.get("/login", (req, res) => {
  authenticateRequest(req).then((authenticated) => {
    authenticated ? res.redirect("/") : res.render("login", { errors: [] });
  });
});

app.post("/login", urlencodedParser, (req, res) => {
  login(req).then((_) => {
    res.redirect("/");
  }).catch((err) => {
    // tslint:disable-next-line:no-console
    console.log(err);
    res.render("login", { errors: ["An error occured."] });
  });
});

app.get("/", requiresLogin, (req, res) => {
  // TODO: Reduce duplication by creating a View object with default attributes.
  res.render("index", { roleTypes: ROLE_TYPE_CHOICE_MAP, errors: [] });
});

app.post("/search", urlencodedParser, requiresLogin, (req, res) => {
  const roleType = parseInt(req.body.preferredRoleType, 10);
  const customReq = req as ICustomizedRequest;
  matchMaker.match({user: customReq.user, roleType}).then((matchedRoom) => {
    res.redirect(`/games/${matchedRoom.getId()}`);
  }).catch((err) => {
    // tslint:disable-next-line:no-console
    console.log(err);
    res.render("index", { roleTypes: ROLE_TYPE_CHOICE_MAP, errors: [":("] });
  });
});

app.get("/games/:roomId", requiresLogin, (req, res) => {
  const gameRoom = GameRoom.find(req.params.roomId);
  const customReq = req as ICustomizedRequest;
  const authorized = authorizeParticipation(customReq.user, gameRoom);

  authorized ? res.render("game") : res.render("error");
});

httpServer.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});

io.use(sharedSession(sessionMiddleWare, { autoSave: true }));
io.use(authenticateSocket);
io.on("connection", (socket) => {
  const wrappedSocket = new WrappedSocket(socket);
  const room = wrappedSocket.getGameRoom();
  const client = new GameClient(wrappedSocket);
  room.addClient(client);
  room.startGame();
});
