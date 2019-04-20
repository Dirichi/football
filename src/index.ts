import express from "express";
import * as http from "http";
import path from "path";
import socketIo from "socket.io";
import { ChaseBallCommand } from "./commands/chase_ball_command";
import { MoveDownCommand } from "./commands/move_down_command";
import { MoveLeftCommand } from "./commands/move_left_command";
import { MoveRightCommand } from "./commands/move_right_command";
import { MoveUpCommand } from "./commands/move_up_command";
import { PassBallCommand } from "./commands/pass_ball_command";
import { ShootBallCommand } from "./commands/shoot_ball_command";
import { StopCommand } from "./commands/stop_command";
// TODO: This is starting to look ugly
import { BALL_INITIAL_ARGS, BOX18A_INITIAL_COORDINATES,
  BOX18B_INITIAL_COORDINATES, BOX6A_INITIAL_COORDINATES,
  BOX6B_INITIAL_COORDINATES, COMMANDS, constants, EVENTS,
  FIELD_INITIAL_COORDINATES, PLAYER_INITIAL_ARGS, POSTA_INITIAL_COORDINATES,
  POSTB_INITIAL_COORDINATES } from "./constants";
import { EventQueue } from "./event_queue";
import { Ball } from "./game_objects/ball";
import { Box } from "./game_objects/box";
import { Field } from "./game_objects/field";
import { Player } from "./game_objects/player";
import { Post } from "./game_objects/post";
import { ICommand } from "./interfaces/icommand";
import { BallPhysics } from "./physics/ball_physics";
import { PlayerPhysics } from "./physics/player_physics";
import { BallPossessionService } from "./services/ball_possession_service";
import { CollisionDetectionService } from "./services/collision_detection_service";
import { CollisionNotificationService } from "./services/collision_notification_service";
const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);
const port = 3000;

const queue = new EventQueue();
const collisionDetectionService = new CollisionDetectionService();
const collisionNotificationService = new CollisionNotificationService(
  collisionDetectionService, queue);

// TODO: Perhaps if these game objects were initialized with hashes, this part
// of the code would not look so messy.
const [fieldx, fieldy, fieldxlength, fieldylength] = FIELD_INITIAL_COORDINATES;
const field = new Field(fieldx, fieldy, fieldxlength, fieldylength);

const [ballx, bally, ballvx, ballvy, balldiameter] = BALL_INITIAL_ARGS;
const ballPhysics = new BallPhysics(field);
const ball = new Ball(ballx, bally, ballvx, ballvy, balldiameter);
ball.setPhysics(ballPhysics);
ball.setMaximumSpeed(constants.BALL_DEFAULT_SPEED);

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

const [playerx, playery, playervx, playervy, playerSpeed, playerdiameter]
  = PLAYER_INITIAL_ARGS;
const playerPhysicsA = new PlayerPhysics(field);
const playerA = new Player(playerx, playery, playervx, playervy, playerdiameter);
playerA.setMaximumSpeed(playerSpeed);
playerA.setPhysics(playerPhysicsA);
playerA.setOpposingGoalPost(postA);

const [playerbx, playerby, playerbvx, playerbvy, playerbSpeed, playerbdiameter]
  = PLAYER_INITIAL_ARGS;
const playerPhysicsB = new PlayerPhysics(field);
const playerB = new Player(0.8, 0.3, playerbvx, playerbvy, playerbdiameter);
playerA.setMaximumSpeed(playerbSpeed);
playerB.setPhysics(playerPhysicsB);
playerB.setOpposingGoalPost(postB);

const players = [playerA, playerB];
const ballPossessionService = new BallPossessionService(ball, players);

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

interface IhashMapOfCommands {
  [key: string]: ICommand;
}

const NAME_TO_COMMAND_MAPPING: IhashMapOfCommands = {
  [COMMANDS.MOVE_PLAYER_DOWN]: new MoveDownCommand(),
  [COMMANDS.MOVE_PLAYER_LEFT]: new MoveLeftCommand(),
  [COMMANDS.MOVE_PLAYER_RIGHT]: new MoveRightCommand(),
  [COMMANDS.MOVE_PLAYER_UP]: new MoveUpCommand(),
  [COMMANDS.CHASE_BALL]: new ChaseBallCommand(ball),
  [COMMANDS.PASS_BALL]: new PassBallCommand(ball, ballPossessionService, [playerB]),
  [COMMANDS.SHOOT_BALL]: new ShootBallCommand(ball, ballPossessionService),
  [COMMANDS.STOP]: new StopCommand(),
};

io.on("connection", (socket) => {
  socket.on("command", (data) => {
    const key = data as string;
    const command = NAME_TO_COMMAND_MAPPING[key];
    if (command) {
      command.execute(playerA);
    }
  });

  setInterval(() => {
    ball.update();
    players.forEach((player) => player.update());
    const data = {
      [EVENTS.BALL_DATA]: ball.serialized(),
      [EVENTS.BOXES_DATA]: boxes.map((box) => box.serialized()),
      [EVENTS.FIELD_DATA]: field.serialized(),
      [EVENTS.PLAYER_DATA]: players.map((player) => player.serialized()),
      [EVENTS.POSTS_DATA]: posts.map((post) => post.serialized()),
    };
    socket.emit(EVENTS.STATE_CHANGED, data);
  }, 20);
});
