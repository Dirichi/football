import { GameStateMachine } from "./game_ai/game/game_state_machine";
import { KickOffState } from "./game_ai/game/kickoff_state";
import { AttackingRunState } from "./game_ai/player/state_machine/attacking_run_state";
import {
  AttackingPositionValueCalculator
} from "./game_ai/player/state_machine/calculators/attacking_position_value_calculator";
import { CongestionCalculator } from "./game_ai/player/state_machine/calculators/congestion_calculator";
import {
  DefendingPositionValueCalculator
} from "./game_ai/player/state_machine/calculators/defending_position_value_calculator";
import { DribbleValueCalculator } from "./game_ai/player/state_machine/calculators/dribble_value_calculator";
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
import { GenericRemoteCommandRequestHandler } from "./commands/generic_remote_command_request_handler";
import { MoveCommand } from "./commands/move_command";
import { MovePlayerRemoteCommandRequestHandler } from "./commands/move_player_remote_command_request_handler";
import { MoveToAttackingPositionCommand } from "./commands/move_to_attacking_position_command";
import { MoveToDefensivePositionCommand } from "./commands/move_to_defensive_position_command";
import { PassBallCommand } from "./commands/pass_ball_command";
import { PassBallRemoteCommandRequestHandler } from "./commands/pass_ball_remote_command_request_handler";
import { ShootBallCommand } from "./commands/shoot_ball_command";
import { StopCommand } from "./commands/stop_command";
// TODO: This is starting to look ugly
import { BALL_INITIAL_ARGS, BOX18A_INITIAL_COORDINATES,
  BOX18B_INITIAL_COORDINATES, BOX6A_INITIAL_COORDINATES,
  BOX6B_INITIAL_COORDINATES, COLLISION_MARGIN_FACTOR, COMMAND_ID, constants,
  EVENTS, FIELD_INITIAL_COORDINATES, PLAYER_INITIAL_ARGS,
  PLAYER_ROLE, PLAYER_ROLE_TYPE, POSTA_INITIAL_COORDINATES,
  POSTB_INITIAL_COORDINATES, PROCESS_MESSAGE_TYPE, RADIUS_FOR_CONGESTION,
  TEAM_SIDES
  } from "./constants";
import { EventQueue } from "./event_queue";
import { Game } from "./game";
import { PlayerHumanController } from "./game_ai/player/human_controller/player_human_controller";
import { PlayerStateMachine } from "./game_ai/player/state_machine/player_state_machine";
import { PLAYER_ROLES_CONFIGURATION } from "./game_configs/player_roles_config";
import { Ball } from "./game_objects/ball";
import { Box } from "./game_objects/box";
import { Field } from "./game_objects/field";
import { FieldRegion } from "./game_objects/field_region";
import { Player } from "./game_objects/player";
import { PlayerRole } from "./game_objects/player_role";
import { Post } from "./game_objects/post";
import { Team } from "./game_objects/team";
import { ICommand } from "./interfaces/icommand";
import { ICommandRequest } from "./interfaces/icommand_request";
import { ICommandRequestHandler } from "./interfaces/icommand_request_handler";
import { IPlayerState } from "./interfaces/iplayer_state";
import { IProcessMessage } from "./interfaces/iprocess_message";
import { BallPhysics } from "./physics/ball_physics";
import { PlayerPhysics } from "./physics/player_physics";
import { BallPossessionService } from "./services/ball_possession_service";
import { CollisionDetectionService } from "./services/collision_detection_service";
import { CollisionNotificationService } from "./services/collision_notification_service";
import { GoalDetectionService } from "./services/goal_detection_service";
import { GoalRecordService } from "./services/goal_record_service";
import { PlayerBallInteractionMediator } from "./services/player_ball_interaction_mediator";
import { PositionValueDebugService } from "./services/position_value_debug_service";
import { TickService } from "./services/tick_service";
import { TimerService } from "./timer_service";
import { range } from "./utils/helper_functions";

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
const ballPhysics = new BallPhysics(field);
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

const buildDefaultPlayerPhysics = (): PlayerPhysics => {
  const physics = new PlayerPhysics(field);
  physics.setFriction(constants.PLAYER_PHYSICS_DEFAULT_FRICTION);
  return physics;
};

const buildDefaultPlayer = (): Player => {
  const player = new Player(0, 0, 0, 0, playerDiameter);
  return player.setPhysics(buildDefaultPlayerPhysics())
    .setMaximumSpeed(playerSpeed)
    .setMessageQueue(queue);
};

const teamSize = 11;
const teamAPlayers = range(teamSize).map((_) => buildDefaultPlayer());
const teamBPlayers = range(teamSize).map((_) => buildDefaultPlayer());
const defaultPlayers = [...teamAPlayers, ...teamBPlayers];

const ballPossessionService =
  new BallPossessionService(ball, defaultPlayers, queue);
const teamA = new Team(teamAPlayers);
const teamB = new Team(teamBPlayers);

const teams = [teamA, teamB];
teamA.setSide(TEAM_SIDES.LEFT)
  .setGoalPost(postA)
  .setOpposition(teamB)
  .setOpposingGoalPost(postB)
  .setColors([0, 0, 225])
  .setKickOffStartingPlayer(teamAPlayers[teamSize - 1])
  .setKickOffSupportingPlayer(teamAPlayers[teamSize - 2]);

teamB.setSide(TEAM_SIDES.RIGHT)
  .setGoalPost(postB)
  .setOpposition(teamA)
  .setOpposingGoalPost(postA)
  .setColors([225, 0, 0])
  .setKickOffStartingPlayer(teamBPlayers[teamSize - 1])
  .setKickOffSupportingPlayer(teamBPlayers[teamSize - 2]);

const teamAroles = [
  PlayerRole.get(PLAYER_ROLE.GK, field),
  PlayerRole.get(PLAYER_ROLE.LB, field),
  PlayerRole.get(PLAYER_ROLE.RB, field),
  PlayerRole.get(PLAYER_ROLE.LCB, field),
  PlayerRole.get(PLAYER_ROLE.RCB, field),
  PlayerRole.get(PLAYER_ROLE.LM, field),
  PlayerRole.get(PLAYER_ROLE.RM, field),
  PlayerRole.get(PLAYER_ROLE.LCM, field),
  PlayerRole.get(PLAYER_ROLE.RCM, field),
  PlayerRole.get(PLAYER_ROLE.LF, field),
  PlayerRole.get(PLAYER_ROLE.RF, field),
];

const teamBroles = [
  PlayerRole.get(PLAYER_ROLE.GK, field),
  PlayerRole.get(PLAYER_ROLE.LB, field),
  PlayerRole.get(PLAYER_ROLE.RB, field),
  PlayerRole.get(PLAYER_ROLE.LCB, field),
  PlayerRole.get(PLAYER_ROLE.RCB, field),
  PlayerRole.get(PLAYER_ROLE.LM, field),
  PlayerRole.get(PLAYER_ROLE.RM, field),
  PlayerRole.get(PLAYER_ROLE.LCM, field),
  PlayerRole.get(PLAYER_ROLE.RCM, field),
  PlayerRole.get(PLAYER_ROLE.LF, field),
  PlayerRole.get(PLAYER_ROLE.RF, field),
];

teamA.setRoles(teamAroles);
teamB.setRoles(teamBroles);
collisionNotificationService.registerCollisionGroup([ball, ...defaultPlayers]);

const interceptionCalculator = new InterceptionCalculator();
const shotValueCalculator =
  new ShotValueCalculator(ball, field, interceptionCalculator);
const congestionCalculator =
  new CongestionCalculator(defaultPlayers, RADIUS_FOR_CONGESTION);
const positionValueCalculator = new AttackingPositionValueCalculator(
  ball, field, congestionCalculator, shotValueCalculator);
const passValueCalculator = new PassValueCalculator(
  ball, interceptionCalculator, positionValueCalculator);
const dribbleValueCalculator =
  new DribbleValueCalculator(positionValueCalculator, interceptionCalculator);

const defensePositionValueCalculator =
  new DefendingPositionValueCalculator(ball, field, congestionCalculator);

const positionValueDebugService =
  new PositionValueDebugService(
    defensePositionValueCalculator, defaultPlayers);

const featureExtractor =
  new PlayerStateFeatureExtractor(
    ball,
    ballPossessionService,
    passValueCalculator,
    shotValueCalculator,
    positionValueCalculator,
    dribbleValueCalculator,
    defensePositionValueCalculator);

const COMMAND_ID_TO_COMMAND_MAPPING = new Map<COMMAND_ID, ICommand>([
      [COMMAND_ID.MOVE, new MoveCommand()],
      [COMMAND_ID.CHASE_BALL, new ChaseBallCommand()],
      [COMMAND_ID.SHOOT_BALL, new ShootBallCommand()],
      [COMMAND_ID.PASS_BALL, new PassBallCommand()],
      [COMMAND_ID.STOP, new StopCommand()],
      [COMMAND_ID.MOVE_TO_ATTACKING_POSITION, new MoveToAttackingPositionCommand()],
      [COMMAND_ID.MOVE_TO_DEFENSIVE_POSITION, new MoveToDefensivePositionCommand()],
    ]);

const commandFactory = new CommandFactory(COMMAND_ID_TO_COMMAND_MAPPING);

const PLAYER_STATES: IPlayerState[] = [
      new WaitingState(commandFactory, featureExtractor),
      new AttackingRunState(commandFactory, featureExtractor),
      new DefensiveRunState(commandFactory, featureExtractor),
      new ChasingBallState(commandFactory, featureExtractor),
      new ShootingState(commandFactory, featureExtractor),
      new DribblingState(commandFactory, featureExtractor),
      new PassingState(commandFactory, featureExtractor),
    ];

const buildStateMachine = (player: Player) => {
  const machine = new PlayerStateMachine(player, PLAYER_STATES);
  return machine;
};

defaultPlayers.forEach((player) => {
  player.setController(buildStateMachine(player));
});
// TODO: Replace this with a controller that listens to commands from a specific
// user.

ballPossessionService.enable();
collisionDetectionService.setCollisionMarginFactor(COLLISION_MARGIN_FACTOR);

const genericHandler =
  new GenericRemoteCommandRequestHandler(commandFactory);
const passHandler =
  new PassBallRemoteCommandRequestHandler(commandFactory);
const moveHandler = new MovePlayerRemoteCommandRequestHandler(commandFactory);

const commandHandlerRouter = new Map<string, ICommandRequestHandler>([
  [COMMAND_ID.PASS_BALL as string, passHandler],
  ["move.player.*", moveHandler],
  [".*", genericHandler],
]);

const initialState = new KickOffState();
const gameStateMachine = new GameStateMachine(initialState);
const timer = new TimerService(0, 0.02, 90);
const goalDetectionService = new GoalDetectionService(ball, posts);
const goalRecordService = new GoalRecordService(goalDetectionService, teams);
const game = new Game();
game.setBall(ball)
  .setTeams(teams)
  .setBoxes(boxes)
  .setField(field)
  .setRegions(regions)
  .setPosts(posts)
  .setStateMachine(gameStateMachine)
  .setTimer(timer)
  .setGoalDetectionService(goalDetectionService)
  .setGoalRecordService(goalRecordService)
  .setPositionValueDebugService(positionValueDebugService);

const tickService = new TickService(queue);
const mediator =
  new PlayerBallInteractionMediator(
    ball, ballPossessionService, tickService, 20);

defaultPlayers.forEach((player) => player.setBallInteractionMediator(mediator));

setInterval(() => {
  tickService.tick();
  ballPossessionService.update();
  collisionNotificationService.update();
  game.update();

  process.send({
    data: game.getState(),
    messageType: PROCESS_MESSAGE_TYPE.GAME_STATE,
  });
}, 20);

const playersAvailableForRemoteControl = [...defaultPlayers];
const remoteControllers: PlayerHumanController[] = [];

interface IAssignControllerRequest {
  clientId: string;
  role: PLAYER_ROLE_TYPE;
}

const handleAssignControllerRequest = (request: IAssignControllerRequest ) => {
  const selectedPlayer = playersAvailableForRemoteControl.find((player) => {
    return player.getRoleType() === request.role;
  });
  const controller =
    new PlayerHumanController(selectedPlayer, commandHandlerRouter);
  controller.setRemoteClientId(request.clientId);
  selectedPlayer.disableControls();
  selectedPlayer.setController(controller);
  remoteControllers.push(controller);
};

const handleCommandRequest = (request: ICommandRequest) => {
  const matchingController = remoteControllers.find((controller) => {
    return controller.getRemoteClientId() === request.clientId;
  });

  if (matchingController) {
    matchingController.handleCommandRequest(request);
  }
};

// TODO: We may need an abstraction to handle messaging between
// the main process and the child process. This would make it easy to
// run a game in the parent process if we wanted to.
process.on("message", (message: IProcessMessage) => {
  if (message.messageType === PROCESS_MESSAGE_TYPE.COMMAND) {
    handleCommandRequest(message.data as ICommandRequest);
    return;
  }

  if (message.messageType === PROCESS_MESSAGE_TYPE.ASSIGN_CONTROLLER) {
    handleAssignControllerRequest(message.data as IAssignControllerRequest);
    return;
  }
});
