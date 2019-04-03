import express from "express";
import * as http from "http";
import path from "path";
import socketIo from "socket.io";
import { Ball } from "./ball";
import { BallPhysics } from "./ball_physics";
import { Box } from "./box";
import { BALL_INITIAL_ARGS, BOX18A_INITIAL_COORDINATES,
  BOX18B_INITIAL_COORDINATES, BOX6A_INITIAL_COORDINATES, BOX6B_INITIAL_COORDINATES,
  constants, FIELD_INITIAL_COORDINATES,
  POSTA_INITIAL_COORDINATES, POSTB_INITIAL_COORDINATES } from "./constants";
import { Field } from "./field";
import { Post } from "./post";

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);
const port = 3000;

const field = new Field(FIELD_INITIAL_COORDINATES);

const ball = new Ball(BALL_INITIAL_ARGS);
const ballPhysics = new BallPhysics(field);

const postA = new Post(POSTA_INITIAL_COORDINATES);
const postB = new Post(POSTB_INITIAL_COORDINATES);
const posts = [postA, postB];

const box6A = new Box(BOX6A_INITIAL_COORDINATES);
const box6B = new Box(BOX6B_INITIAL_COORDINATES);
const box18A = new Box(BOX18A_INITIAL_COORDINATES);
const box18B = new Box(BOX18B_INITIAL_COORDINATES);
const boxes = [box18A, box18B, box6A, box6B];

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.render("index");
});

// start the Express server
httpServer.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});

io.on("connection", (socket) => {
  const x = 0;
  // tslint:disable-next-line:no-console
  console.log("a user connected");
  setInterval(() => {
    const data = {
      "ball.data": ball.serialized(),
      // "boxes.data": boxes.map((box) => box.serialized()),
      "field.data": field.serialized(),
      // "posts.data": posts.map((post) => post.serialized()),
    };
    socket.emit("state.changed", data);
  }, 2000);
});
