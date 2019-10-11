import bodyParser from "body-parser";
import connectRedis = require("connect-redis");
import express from "express";
import session from "express-session";
import sharedSession from "express-socket.io-session";
import * as http from "http";
import path from "path";
import redis from "redis";
import socketIo from "socket.io";

import {
  authenticateRequest,
  authenticateSocket,
  authorizeParticipation,
  login,
  requiresLogin
} from "./app_services/auth";
import { MatchMakerService } from "./app_services/match_maker_service";
import { ROLE_TYPE_CHOICE_MAP } from "./constants";
import { GameClient } from "./game_client";
import { GameRoom } from "./game_room";
import { ICustomizedRequest } from "./interfaces/icustomized_request";
import { Logger } from "./utils/logger";
import { WrappedSocket } from "./wrapped_socket";

const app = express();
const httpServer = http.createServer(app);
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const io = socketIo(httpServer);
const port = process.env.PORT;
// TODO Provide the configuration of the redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST
});
const RedisStore = connectRedis(session);
const sessionMiddleWare = session({
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
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
    Logger.log(err);
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
    Logger.log(
      `matched user ${customReq.user.id} to room ${matchedRoom.getId()}`);
    res.redirect(`/games/${matchedRoom.getId()}`);
  }).catch((err) => {
    Logger.log(err);
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
  Logger.log(`server started at http://localhost:${port}`);
});

io.use(sharedSession(sessionMiddleWare, { autoSave: true }));
io.use(authenticateSocket);
io.on("connection", (socket) => {
  const wrappedSocket = new WrappedSocket(socket);
  const client = new GameClient(wrappedSocket);
  client.joinAssignedRoom();
});
