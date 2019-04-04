import express from "express";
import * as http from "http";
import path from "path";
import socketIo from "socket.io";
import { Ball } from "./ball";
import { BallPhysics } from "./ball_physics";
import { Box } from "./box";
import { BALL_INITIAL_ARGS, BOX18A_INITIAL_COORDINATES,
  BOX18B_INITIAL_COORDINATES, BOX6A_INITIAL_COORDINATES,
  BOX6B_INITIAL_COORDINATES, constants, EVENTS, FIELD_INITIAL_COORDINATES,
  POSTA_INITIAL_COORDINATES, POSTB_INITIAL_COORDINATES } from "./constants";
import { Field } from "./field";
import { Post } from "./post";

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);
const port = 3000;

// TODO: Perhaps if these game objects were initialized with hashes, this part
// of the code would not look so messy.
const [fieldx, fieldy, fieldxlength, fieldylength] = FIELD_INITIAL_COORDINATES;
const field = new Field(fieldx, fieldy, fieldxlength, fieldylength);

const [ballx, bally, ballvx, ballvy, balldiameter] = BALL_INITIAL_ARGS;
const ball = new Ball(ballx, bally, ballvx, ballvy, balldiameter);
const ballPhysics = new BallPhysics(field);

const [postAX, postAY, postAXlength, postAYlength] = POSTA_INITIAL_COORDINATES;
const postA = new Post(postAX, postAY, postAXlength, postAYlength);

const [postBX, postBY, postBXlength, postBYlength] = POSTB_INITIAL_COORDINATES;
const postB = new Post(postBX, postBY, postBXlength, postBYlength);
const posts = [postA, postB];

const [box6AX, box6AY, box6AXlength, box6AYlength] = BOX6A_INITIAL_COORDINATES;
const box6A = new Box(box6AX, box6AY, box6AXlength, box6AYlength);

const [box6BX, box6BY, box6BXlength, box6BYlength] = BOX6B_INITIAL_COORDINATES;
const box6B = new Box(box6BX, box6BY, box6BXlength, box6BYlength);

const [box18AX, box18AY, box18AXlength, box18AYlength]
  = BOX18A_INITIAL_COORDINATES;
const box18A = new Box(box18AX, box18AY, box18AXlength, box18AYlength);

const [box18BX, box18BY, box18BXlength, box18BYlength]
  = BOX18B_INITIAL_COORDINATES;
const box18B = new Box(box18BX, box18BY, box18BXlength, box18BYlength);

const boxes = [box18A, box18B, box6A, box6B];

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
  setInterval(() => {
    ballPhysics.update(ball);
    const data = {
      [EVENTS.BALL_DATA]: ball.serialized(),
      [EVENTS.BOXES_DATA]: boxes.map((box) => box.serialized()),
      [EVENTS.FIELD_DATA]: field.serialized(),
      [EVENTS.POSTS_DATA]: posts.map((post) => post.serialized()),
    };
    socket.emit(EVENTS.STATE_CHANGED, data);
  }, 100);
});
