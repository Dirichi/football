import { GameStateMachine } from "./game_ai/game/game_state_machine";
import { KickOffState } from "./game_ai/game/kickoff_state";
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

import { ChaseBallCommand } from "./commands/chase_ball_command";
import { CommandFactory } from "./commands/command_factory";
import { GenericCommandHandler } from "./commands/generic_command_handler";
import { MoveDownCommand } from "./commands/move_down_command";
import { MoveLeftCommand } from "./commands/move_left_command";
import { MoveRightCommand } from "./commands/move_right_command";
import { MoveToAttackingPositionCommand } from "./commands/move_to_attacking_position_command";
import { MoveToDefensivePositionCommand } from "./commands/move_to_defensive_position_command";
import { MoveUpCommand } from "./commands/move_up_command";
import { PassBallCommand } from "./commands/pass_ball_command";
import { PassBallCommandHandler } from "./commands/pass_ball_command_handler";
import { ShootBallCommand } from "./commands/shoot_ball_command";
import { StopCommand } from "./commands/stop_command";
// TODO: This is starting to look ugly
import { BALL_INITIAL_ARGS, BOX18A_INITIAL_COORDINATES,
  BOX18B_INITIAL_COORDINATES, BOX6A_INITIAL_COORDINATES,
  BOX6B_INITIAL_COORDINATES, COLLISION_MARGIN_FACTOR, COMMAND_ID, constants,
  EVENTS, FIELD_INITIAL_COORDINATES, PLAYER_INITIAL_ARGS,
  POSTA_INITIAL_COORDINATES, POSTB_INITIAL_COORDINATES, PROCESS_MESSAGE_TYPE,
  TEAM_SIDES
  } from "./constants";
import { EventQueue } from "./event_queue";
import { Game } from "./game";
import { PlayerNullController } from "./game_ai/player/null_controller/player_null_controller";
import { PlayerStateMachine } from "./game_ai/player/state_machine/player_state_machine";
import { Ball } from "./game_objects/ball";
import { Box } from "./game_objects/box";
import { Field } from "./game_objects/field";
import { FieldRegion } from "./game_objects/field_region";
import { Player } from "./game_objects/player";
import { Post } from "./game_objects/post";
import { Team } from "./game_objects/team";
import { ICommand } from "./interfaces/icommand";
import { ICommandHandler } from "./interfaces/icommand_handler";
import { ICommandRequest } from "./interfaces/icommand_request";
import { IPlayerState } from "./interfaces/iplayer_state";
import { BallPhysics } from "./physics/ball_physics";
import { PlayerPhysics } from "./physics/player_physics";
import { BallPossessionService } from "./services/ball_possession_service";
import { CollisionDetectionService } from "./services/collision_detection_service";
import { CollisionNotificationService } from "./services/collision_notification_service";

// TODO: Alright we need to introduce proper logging.
// tslint:disable-next-line:no-console
console.log("started a new game process");

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
ball.setKickOffPosition(field.getMidPoint());

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
const aiPlayers = [playerB, playerC, playerD, playerE, playerF];

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

collisionNotificationService.registerCollisionGroup([ball, ...players]);

const moveDownCommand = new MoveDownCommand();
const moveLeftCommand = new MoveLeftCommand();
const moveRightCommand = new MoveRightCommand();
const moveUpCommand = new MoveUpCommand();
const chaseBallCommand = new ChaseBallCommand(ball, ballPossessionService);
const passBallCommand = new PassBallCommand(ball, ballPossessionService);
const stopCommand = new StopCommand();
const shootBallCommand = new ShootBallCommand(ball, ballPossessionService);
const moveToAttackingPositionCommand = new MoveToAttackingPositionCommand();
const moveToDefensivePositionCommand = new MoveToDefensivePositionCommand();

const COMMAND_ID_TO_COMMAND_MAPPING = new Map<COMMAND_ID, ICommand>([
  [COMMAND_ID.MOVE_PLAYER_DOWN, moveDownCommand],
  [COMMAND_ID.MOVE_PLAYER_LEFT, moveLeftCommand],
  [COMMAND_ID.MOVE_PLAYER_RIGHT, moveRightCommand],
  [COMMAND_ID.MOVE_PLAYER_UP, moveUpCommand],
  [COMMAND_ID.CHASE_BALL, chaseBallCommand],
  [COMMAND_ID.SHOOT_BALL, shootBallCommand],
  [COMMAND_ID.PASS_BALL, passBallCommand],
  [COMMAND_ID.STOP, stopCommand],
  [COMMAND_ID.MOVE_TO_ATTACKING_POSITION, moveToAttackingPositionCommand],
  [COMMAND_ID.MOVE_TO_DEFENSIVE_POSITION, moveToDefensivePositionCommand],
]);

const commandFactory = new CommandFactory(COMMAND_ID_TO_COMMAND_MAPPING);

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
const passValueCalculator =
  new PassValueCalculator(ball, interceptionCalculator);
const shotValueCalculator =
  new ShotValueCalculator(ball, interceptionCalculator);

const featureExtractor = new PlayerStateFeatureExtractor(
  ball, ballPossessionService, passValueCalculator, shotValueCalculator);

const buildStateMachine = (player: Player) => {
  const machine = new PlayerStateMachine(player, PLAYER_STATES);
  machine.setFeatureExtractor(featureExtractor);
  return machine;
};

aiPlayers.forEach((player) => player.setController(buildStateMachine(player)));
playerA.setController(new PlayerNullController(playerA));

players.forEach((player) => player.setMessageQueue(queue));
ballPossessionService.enable();
collisionDetectionService.setCollisionMarginFactor(COLLISION_MARGIN_FACTOR);

const genericHandler = new GenericCommandHandler(playerA, commandFactory);
const passHandler = new PassBallCommandHandler(playerA, commandFactory);

const commandHandlerRouter = new Map<string, ICommandHandler>([
  [COMMAND_ID.PASS_BALL as string, passHandler],
  [".*", genericHandler],
]);

const initialState = new KickOffState();
const gameStateMachine = new GameStateMachine(initialState);
const game = new Game();
game.setBall(ball)
  .setTeams(teams)
  .setBoxes(boxes)
  .setField(field)
  .setRegions(regions)
  .setPosts(posts)
  .setStateMachine(gameStateMachine);

setInterval(() => {
  ballPossessionService.update();
  collisionNotificationService.update();
  game.update();

  process.send({
    data: game.getState(),
    messageType: PROCESS_MESSAGE_TYPE.GAME_STATE,
  });
}, 20);

// TODO: We may need an abstraction to handle messaging between
// the main process and the child process. This would make it easy to
// run a game in the parent process if we wanted to.
process.on("message", (commandRequest: ICommandRequest) => {
  const commandId = commandRequest.commandId as string;
  const commandPaths = [...commandHandlerRouter.keys()];
  const matchingCommandPath = commandPaths.find((commandPath) => {
    return commandId.match(commandPath) !== null;
  });

  if (matchingCommandPath) {
    commandHandlerRouter.get(matchingCommandPath).handle(commandRequest);
  }
});
