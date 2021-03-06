import { GameStateMachine } from "./game_ai/game/game_state_machine";
import { KickOffState } from "./game_ai/game/kickoff_state";

import { ChaseBallCommand } from "./commands/chase_ball_command";
import { CommandFactory } from "./commands/command_factory";
import { GenericRemoteCommandRequestHandler } from "./commands/generic_remote_command_request_handler";
import { MoveCommand } from "./commands/move_command";
import { MovePlayerRemoteCommandRequestHandler } from "./commands/move_player_remote_command_request_handler";
import { PassBallCommand } from "./commands/pass_ball_command";
import { PassBallRemoteCommandRequestHandler } from "./commands/pass_ball_remote_command_request_handler";
import { ShootBallCommand } from "./commands/shoot_ball_command";
import { ShootBallRemoteCommandRequestHandler } from "./commands/shoot_ball_remote_command_request_handler";
import { StopCommand } from "./commands/stop_command";
import { Logger } from "./utils/logger";

// TODO: This is starting to look ugly
import { CallForBallCommand } from "./commands/call_for_ball_command";
import { KeeperGuardPostCommand } from "./commands/keeper_guard_post_command";
import {
  BALL_INITIAL_ARGS, BOX18A_INITIAL_COORDINATES,
  BOX18B_INITIAL_COORDINATES, BOX6A_INITIAL_COORDINATES,
  BOX6B_INITIAL_COORDINATES, COMMAND_ID, constants,
  DEFAULT_TEAM_A_ROLES,
  DEFAULT_TEAM_B_ROLES, FIELD_INITIAL_COORDINATES, GAME_STATE_UPDATE_DELAY,
  PLAYER_INITIAL_ARGS, POSTA_INITIAL_COORDINATES,
  POSTB_INITIAL_COORDINATES, PROCESS_MESSAGE_TYPE, TEAM_ID, TEAM_SIDES
} from "./constants";
import { EventQueue } from "./event_queue";
import { Game } from "./game";
import { PlayerHumanController } from "./game_ai/player/human_controller/player_human_controller";
import { PlayerStateMachineModule } from "./game_ai/player/state_machine/player_state_machine_module";
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
import { IParticipationAttributes } from "./interfaces/iparticipation_attributes";
import { IProcessMessage } from "./interfaces/iprocess_message";
import { BallPhysics } from "./physics/ball_physics";
import { PlayerPhysics } from "./physics/player_physics";
import { BallPossessionService } from "./services/ball_possession_service";
import { GoalDetectionService } from "./services/goal_detection_service";
import { GoalRecordService } from "./services/goal_record_service";
import { PlayerBallInteractionMediator } from "./services/player_ball_interaction_mediator";
import { PositionValueDebugService } from "./services/position_value_debug_service";
import { TickService } from "./services/tick_service";
import { PassTrackerService } from "./stats/pass_tracker_service";
import { PlayerReportService } from "./stats/player_report_service";
import { ShotTrackerService } from "./stats/shot_tracker_service";
import { TimerService } from "./timer_service";
import { range } from "./utils/helper_functions";

Logger.log("started a new game process");

const queue = new EventQueue();

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

const buildDefaultPlayer = (): Player => {
  const player = new Player(0, 0, 0, 0, playerDiameter);
  const physics = new PlayerPhysics(field)
    .setFriction(constants.PLAYER_PHYSICS_DEFAULT_FRICTION);
  return player.setPhysics(physics)
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
  .setOpposition(teamB)
  .setGoalPost(postA)
  .setOpposingGoalPost(postB)
  .setId(TEAM_ID.WHITE)
  .setKickOffStartingPlayer(teamAPlayers[teamSize - 1])
  .setKickOffSupportingPlayer(teamAPlayers[teamSize - 2]);

teamB.setSide(TEAM_SIDES.RIGHT)
  .setOpposition(teamA)
  .setGoalPost(postB)
  .setOpposingGoalPost(postA)
  .setId(TEAM_ID.RED)
  .setKickOffStartingPlayer(teamBPlayers[teamSize - 1])
  .setKickOffSupportingPlayer(teamBPlayers[teamSize - 2]);

// TODO: Get the roles from the gameSession that starts this executable.
const teamAroles =
  DEFAULT_TEAM_A_ROLES.map((role) => PlayerRole.get(role, field));
const teamBroles =
  DEFAULT_TEAM_B_ROLES.map((role) => PlayerRole.get(role, field));

teamA.setRoles(teamAroles);
teamB.setRoles(teamBroles);

const goalDetectionService = new GoalDetectionService(ball, posts, queue);
const shotTracker = new ShotTrackerService(queue, ballPossessionService, goalDetectionService);
const passTracker = new PassTrackerService(queue, ballPossessionService);
const COMMAND_ID_TO_COMMAND_MAPPING = new Map<COMMAND_ID, ICommand>([
  [COMMAND_ID.MOVE, new MoveCommand()],
  [COMMAND_ID.CHASE_BALL, new ChaseBallCommand()],
  [COMMAND_ID.SHOOT_BALL, new ShootBallCommand().setShotTracker(shotTracker)],
  [COMMAND_ID.PASS_BALL, new PassBallCommand().setPassTracker(passTracker)],
  [COMMAND_ID.STOP, new StopCommand()],
  [COMMAND_ID.GUARD_POST, new KeeperGuardPostCommand()],
  [COMMAND_ID.REQUEST_PASS, new CallForBallCommand()],
]);

const tickService = new TickService(queue);
const commandFactory = new CommandFactory(COMMAND_ID_TO_COMMAND_MAPPING);

const playerStateMachineModule = new PlayerStateMachineModule(
      ball,
      field,
      ballPossessionService,
      tickService,
      commandFactory);

const positionValueDebugService =
  new PositionValueDebugService(
    playerStateMachineModule.getAttackingPositionValueCalculator(),
    defaultPlayers);

defaultPlayers.forEach((player) => {
  player.setController(playerStateMachineModule.getStateMachine());
});

const genericHandler = new GenericRemoteCommandRequestHandler(commandFactory);
const passHandler = new PassBallRemoteCommandRequestHandler(commandFactory);
const shootHandler = new ShootBallRemoteCommandRequestHandler(commandFactory);
const moveHandler = new MovePlayerRemoteCommandRequestHandler(commandFactory);

const commandHandlerRouter = new Map<string, ICommandRequestHandler>([
  [COMMAND_ID.PASS_BALL as string, passHandler],
  [COMMAND_ID.SHOOT_BALL as string, shootHandler],
  ["move.player.*", moveHandler],
  [".*", genericHandler],
]);

const initialState = new KickOffState();
const gameStateMachine = new GameStateMachine(initialState);
const timer = new TimerService(0, 0.04, 90);
const goalRecordService = new GoalRecordService(goalDetectionService, teams);
const playerReportService = new PlayerReportService(passTracker, shotTracker);
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
  .setPositionValueDebugService(positionValueDebugService)
  .setEventQueue(new EventQueue());

const mediator =
  new PlayerBallInteractionMediator(
    ball, ballPossessionService, tickService, 20);

defaultPlayers.forEach((player) => player.setBallInteractionMediator(mediator));

const sendGameState = () => {
  process.send({
    data: game.getState(),
    messageType: PROCESS_MESSAGE_TYPE.GAME_STATE,
  });
};

const sendControllerAssigned = (clientId: string, playerId: string) => {
  process.send({
    data: { clientId, playerId },
    messageType: PROCESS_MESSAGE_TYPE.CONTROLLER_ASSIGNED,
  });
};

// Set up all the things that need setting up
passTracker.setup();
shotTracker.setup();
const taskId = setInterval(() => {
 // ------------------------------
  // these guys are updated here instead of inside the game loop because the
  // update function is not part of their api. But maybe there's nothing
  // wrong with putting them inside the main game loop.
  tickService.tick();
  goalDetectionService.update();
  goalRecordService.update();
  ballPossessionService.update();
  playerReportService.monitorPlayers(defaultPlayers);
// -----------------------------------
  game.update();
  sendGameState();
}, GAME_STATE_UPDATE_DELAY);

const exit = () => {
  Logger.log("ending game...");
  clearInterval(taskId);
  process.send({
    data: playerReportService.getAllReports(),
    messageType: PROCESS_MESSAGE_TYPE.GAME_OVER,
  });
};
game.onReadyToExit(() => exit());

let playersAvailableForRemoteControl = [...defaultPlayers];
const remoteControllers: PlayerHumanController[] = [];

interface IAssignControllerRequest {
  clientId: string;
  participation: IParticipationAttributes;
  team: TEAM_ID;
}

// TODO: Refactor this flow so that we initialize the process with the roles
// rather than pass them in once the process is started
const handleAssignControllerRequest = (request: IAssignControllerRequest) => {
  const selectedPlayer = playersAvailableForRemoteControl.find((player) => {
    return player.getRole().getId() === request.participation.role
      && player.getTeam().getId() === request.participation.teamId;
  });
  if (!selectedPlayer) {
    // TODO: Consider throwing an error here i.e. if we were unable to assign
    // a role to a player.
    Logger.log(`Could not find a position for client ${request.clientId}`);
    return;
  }
  const controller = new PlayerHumanController(commandHandlerRouter);
  controller.setRemoteClientId(request.clientId);
  selectedPlayer.disableControls();
  selectedPlayer.setController(controller);
  remoteControllers.push(controller);
  playersAvailableForRemoteControl =
    playersAvailableForRemoteControl
      .filter((availablePlayer) => availablePlayer !== selectedPlayer);
  sendControllerAssigned(request.clientId, selectedPlayer.getGameObjectId());
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
