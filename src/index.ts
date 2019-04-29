import express from "express";
import * as http from "http";
import path from "path";
import socketIo from "socket.io";
import { AttackingRunState } from "./game_ai/player/state_machine/attacking_run_state";
import { InterceptionCalculator } from "./game_ai/player/state_machine/calculators/interception_calculator";
import { PassValueCalculator } from "./game_ai/player/state_machine/calculators/pass_value_calculator";
import { ShotValueCalculator } from "./game_ai/player/state_machine/calculators/shot_value_calculator";
import { ChasingBallState } from "./game_ai/player/state_machine/chasing_ball_state";
import { DefensiveRunState } from "./game_ai/player/state_machine/defensive_run_state";
import { DribblingState } from "./game_ai/player/state_machine/dribbling_state";
import { PassingState } from "./game_ai/player/state_machine/passing_state";
import { PlayerStateFeatureExtractor } from "./game_ai/player/state_machine/player_state_feature_extractor";
import { ShootingState } from "./game_ai/player/state_machine/shooting_state";
import { WaitingState } from "./game_ai/player/state_machine/waiting_state";

import { AutoDribbleCommand } from "./commands/auto_dribble_command";
import { ChaseBallCommand } from "./commands/chase_ball_command";
import { CommandFactory } from "./commands/command_factory";
import { MoveDownCommand } from "./commands/move_down_command";
import { MoveLeftCommand } from "./commands/move_left_command";
import { MoveRightCommand } from "./commands/move_right_command";
import { MoveToAttackingPositionCommand } from "./commands/move_to_attacking_position_command";
import { MoveToDefensivePositionCommand } from "./commands/move_to_defensive_position_command";
import { MoveUpCommand } from "./commands/move_up_command";
import { PassBallCommand } from "./commands/pass_ball_command";
import { ShootBallCommand } from "./commands/shoot_ball_command";
import { StopCommand } from "./commands/stop_command";
// TODO: This is starting to look ugly
import { BALL_INITIAL_ARGS, BOX18A_INITIAL_COORDINATES,
  BOX18B_INITIAL_COORDINATES, BOX6A_INITIAL_COORDINATES,
  BOX6B_INITIAL_COORDINATES, COLLISION_MARGIN_FACTOR, COMMANDS, constants,
  EVENTS, FIELD_INITIAL_COORDINATES, PLAYER_INITIAL_ARGS,
  POSTA_INITIAL_COORDINATES, POSTB_INITIAL_COORDINATES, TEAM_SIDES
  } from "./constants";
import { EventQueue } from "./event_queue";
import { PlayerStateMachine } from "./game_ai/player/state_machine/player_state_machine";
import { Ball } from "./game_objects/ball";
import { Box } from "./game_objects/box";
import { Field } from "./game_objects/field";
import { FieldRegion } from "./game_objects/field_region";
import { Player } from "./game_objects/player";
import { Post } from "./game_objects/post";
import { Team } from "./game_objects/team";
import { ICommand } from "./interfaces/icommand";
import { IPlayerState } from "./interfaces/iplayer_state";
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
const regions = FieldRegion.generate(field, 10, 5);

const [ballx, bally, ballvx, ballvy, balldiameter] = BALL_INITIAL_ARGS;
const ballPhysics = new BallPhysics(field, queue);
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

const [playerx, playery, playervx, playervy, playerSpeed, playerDiameter]
  = PLAYER_INITIAL_ARGS;

const playerA = new Player(0, 0, 0, 0, playerDiameter);
playerA.setDefendingPosition(regions[5].getMidPoint());
playerA.setAttackingPosition(regions[35].getMidPoint());

const playerB = new Player(0, 0, 0, 0, playerDiameter);
playerB.setDefendingPosition(regions[7].getMidPoint());
playerB.setAttackingPosition(regions[37].getMidPoint());

const playerC = new Player(0, 0, 0, 0, playerDiameter);
playerC.setDefendingPosition(regions[9].getMidPoint());
playerC.setAttackingPosition(regions[39].getMidPoint());

const playerD = new Player(0, 0, 0, 0, playerDiameter);
playerD.setDefendingPosition(regions[40].getMidPoint());
playerD.setAttackingPosition(regions[10].getMidPoint());

const playerE = new Player(0, 0, 0, 0, playerDiameter);
playerE.setDefendingPosition(regions[42].getMidPoint());
playerE.setAttackingPosition(regions[12].getMidPoint());

const playerF = new Player(0, 0, 0, 0, playerDiameter);
playerF.setDefendingPosition(regions[44].getMidPoint());
playerF.setAttackingPosition(regions[14].getMidPoint());

const players = [playerA, playerB, playerC, playerD, playerE, playerF];

players.forEach((player) => {
  const physics = new PlayerPhysics(field, queue);
  physics.setFriction(constants.PLAYER_PHYSICS_DEFAULT_FRICTION);
  player.setPhysics(physics);
  player.positionAtDefendingPosition();
  player.setMaximumSpeed(playerSpeed);
});

const teamA = new Team([playerA, playerB, playerC]);
teamA.setSide(TEAM_SIDES.LEFT);
const teamB = new Team([playerD, playerE, playerF]);
teamB.setSide(TEAM_SIDES.RIGHT);

const teams = [teamA, teamB];
const ballPossessionService = new BallPossessionService(ball, players, queue);

teamA.setOpposition(teamB);
teamB.setOpposition(teamA);

teamA.setOpposingGoalPost(postB);
teamB.setOpposingGoalPost(postA);

teamA.setColors([0, 0, 225]);
teamB.setColors([225, 0, 0]);

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

collisionNotificationService.registerCollisionGroup([ball, ...players]);

const moveDownCommand = new MoveDownCommand();
const moveLeftCommand = new MoveLeftCommand();
const moveRightCommand = new MoveRightCommand();
const moveUpCommand = new MoveUpCommand();
const chaseBallCommand = new ChaseBallCommand(ball);
const passBallCommand = new PassBallCommand(ball, ballPossessionService);
const stopCommand = new StopCommand();
const shootBallCommand = new ShootBallCommand(ball, ballPossessionService);
const moveToAttackingPositionCommand = new MoveToAttackingPositionCommand();
const moveToDefensivePositionCommand = new MoveToDefensivePositionCommand();
const autoDribbleCommand = new AutoDribbleCommand();

const NAME_TO_COMMAND_MAPPING = new Map<COMMANDS, ICommand>([
  [COMMANDS.MOVE_PLAYER_DOWN, moveDownCommand],
  [COMMANDS.MOVE_PLAYER_LEFT, moveLeftCommand],
  [COMMANDS.MOVE_PLAYER_RIGHT, moveRightCommand],
  [COMMANDS.MOVE_PLAYER_UP, moveUpCommand],
  [COMMANDS.CHASE_BALL, chaseBallCommand],
  [COMMANDS.SHOOT_BALL, shootBallCommand],
  [COMMANDS.PASS_BALL, passBallCommand],
  [COMMANDS.STOP, stopCommand],
  [COMMANDS.MOVE_TO_ATTACKING_POSITION, moveToAttackingPositionCommand],
  [COMMANDS.MOVE_TO_DEFENSIVE_POSITION, moveToDefensivePositionCommand],
  [COMMANDS.DRIBBLE, autoDribbleCommand],
]);

const commandFactory = new CommandFactory(NAME_TO_COMMAND_MAPPING);

const PLAYER_STATES: IPlayerState[] = [
  new WaitingState(commandFactory),
  new AttackingRunState(commandFactory),
  new DefensiveRunState(commandFactory),
  new ChasingBallState(commandFactory),
  new ShootingState(commandFactory),
  new PassingState(commandFactory),
  new DribblingState(commandFactory),
];
const interceptionCalculator = new InterceptionCalculator();
const passValueCalculator = new PassValueCalculator(ball, interceptionCalculator);
const shotValueCalculator = new ShotValueCalculator(ball, interceptionCalculator);

const featureExtractor = new PlayerStateFeatureExtractor(
  ball, ballPossessionService, passValueCalculator, shotValueCalculator);

const buildStateMachine = (player: Player) => {
  const machine = new PlayerStateMachine(player, PLAYER_STATES);
  machine.setFeatureExtractor(featureExtractor);
  return machine;
};
players.forEach((player) => player.setController(buildStateMachine(player)));
players.forEach((player) => player.setMessageQueue(queue));
ballPossessionService.enable();
collisionDetectionService.setCollisionMarginFactor(COLLISION_MARGIN_FACTOR);

io.on("connection", (socket) => {
  // socket.on("command", (data) => {
  //   const key = data as string;
  //   const command = NAME_TO_COMMAND_MAPPING[key];
  //   if (command) {
  //     command.execute(playerA);
  //   }
  // });

setInterval(() => {
    collisionNotificationService.update();
    ballPossessionService.update();
    collisionNotificationService.update();
    ball.update();
    players.forEach((player) => player.update());
    const data = {
      [EVENTS.BALL_DATA]: ball.serialized(),
      [EVENTS.BOXES_DATA]: boxes.map((box) => box.serialized()),
      [EVENTS.FIELD_DATA]: field.serialized(),
      [EVENTS.FIELD_REGION_DATA]: regions.map((region) => region.serialized()),
      [EVENTS.PLAYER_DATA]: players.map((player) => player.serialized()),
      [EVENTS.POSTS_DATA]: posts.map((post) => post.serialized()),
    };

    socket.emit(EVENTS.STATE_CHANGED, data);
  }, 20);
});
