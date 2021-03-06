import { IPlayerStateMachineConfig } from "./interfaces/iplayer_state_machine_config";

export const BALL_CONTROL_REFRESH_TIME = 200;

// TODO: This should not be an enum;
// The fact that it is one also limits my ability to
// express these ratios as mathematical relationsips
export enum constants {
  BALL_DIAMETER_TO_FIELD_YLENGTH = 0.01,
  BALL_DEFAULT_SPEED = 0.004,
  BALL_INITIAL_VX = 0,
  BALL_INITIAL_VY = 0,
  BALL_INITIAL_X = 0.6,
  BALL_INITIAL_Y = 0.6,
  BOX6_XLENGTH_TO_FIELD_XLENGTH = 0.06,
  BOX6_YLENGTH_TO_FIELD_YLENGTH = 0.28,
  BOX18_XLENGTH_TO_FIELD_XLENGTH = 0.17,
  BOX18_YLENGTH_TO_FIELD_YLENGTH = 0.58,
  CENTER_CIRCLE_DIAMETER_TO_FIELD_XLENGTH = 0.175,
  FIELD_INITIAL_X = 0,
  FIELD_INITIAL_Y = 0,
  // This is a bug. Field X length and Field Y length should not be the same
  // TODO: Fix this, choose one dimension to base all the others on and go
  // from there
  FIELD_INITIAL_XLENGTH = 1,
  FIELD_INITIAL_YLENGTH = 1,
  PLAYER_DIAMETER_TO_FIELD_YLENGTH = 0.02,
  PLAYER_INITIAL_VX = 0,
  PLAYER_INITIAL_VY = 0,
  PLAYER_INITIAL_X = 0.3,
  PLAYER_INITIAL_Y = 0.8,
  PLAYER_DEFAULT_SPEED = 0.002,
  PLAYER_PHYSICS_DEFAULT_FRICTION = 0.1,
  POST_XLENGTH_TO_FIELD_XLENGTH = 0.01,
  POST_YLENGTH_TO_FIELD_YLENGTH = 0.15,
}

// TODO: This enum is be a misnomer. It should be merged into
// the IO_MESSAGE_TYPE name space.
export enum EVENTS {
  BALL_DATA = "ball.data",
  BOXES_DATA = "boxes.data",
  FIELD_DATA = "field.data",
  FIELD_REGION_DATA = "field_region.data",
  PLAYER_DATA = "player.data",
  POSTS_DATA = "posts.data",
  SCORES_PANEL_DATA = "scores.panel.data",
  GAME_STATE_TEXT_DATA = "game.state.text.data",
  POSITION_VALUE_DEBUG_INFO = "position.debug.info",
  GAME_STATUS = "game.status",
}

export enum DIRECTION {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right"
}

export const ALL_DIRECTIONS = [
  DIRECTION.UP,
  DIRECTION.DOWN,
  DIRECTION.LEFT,
  DIRECTION.RIGHT,
];

export enum COMMAND_ID {
  CHASE_BALL = "chase.ball",
  DRIBBLE = "dribble.ball",
  MOVE_PLAYER_DOWN = "move.player.down",
  MOVE_PLAYER_LOWER_LEFT = "move.player.down.left",
  MOVE_PLAYER_LOWER_RIGHT = "move.player.down.right",
  MOVE_PLAYER_LEFT = "move.player.left",
  MOVE_PLAYER_RIGHT = "move.player.right",
  MOVE_PLAYER_UP = "move.player.up",
  MOVE_PLAYER_UPPER_LEFT = "move.player.up.left",
  MOVE_PLAYER_UPPER_RIGHT = "move.player.up.right",
  PASS_BALL = "pass.ball",
  PASS_BALL_DOWN = "pass.ball.down",
  PASS_BALL_LEFT = "pass.ball.left",
  PASS_BALL_RIGHT = "pass.ball.right",
  PASS_BALL_UP = "pass.ball.up",
  SHOOT_BALL = "shoot.ball",
  STOP = "player.stop",
  MOVE = "player.move",
  GUARD_POST = "guard.post",
  REQUEST_PASS = "request.pass",
}

export const BALL_INITIAL_ARGS = [
  constants.BALL_INITIAL_X as number,
  constants.BALL_INITIAL_Y as number,
  constants.BALL_INITIAL_VX as number,
  constants.BALL_INITIAL_VY as number,
  constants.BALL_DIAMETER_TO_FIELD_YLENGTH as number,
];

export const BOX6A_INITIAL_COORDINATES = [
  constants.FIELD_INITIAL_X as number,
  ((constants.FIELD_INITIAL_YLENGTH - constants.BOX6_YLENGTH_TO_FIELD_YLENGTH) / 2) as number,
  constants.BOX6_XLENGTH_TO_FIELD_XLENGTH as number,
  constants.BOX6_YLENGTH_TO_FIELD_YLENGTH as number,
];

export const BOX6B_INITIAL_COORDINATES = [
  constants.FIELD_INITIAL_XLENGTH - constants.BOX6_XLENGTH_TO_FIELD_XLENGTH,
  ((constants.FIELD_INITIAL_YLENGTH - constants.BOX6_YLENGTH_TO_FIELD_YLENGTH) / 2) as number,
  constants.BOX6_XLENGTH_TO_FIELD_XLENGTH as number,
  constants.BOX6_YLENGTH_TO_FIELD_YLENGTH as number,
];

export const BOX18A_INITIAL_COORDINATES = [
  constants.FIELD_INITIAL_X as number,
  ((constants.FIELD_INITIAL_YLENGTH - constants.BOX18_YLENGTH_TO_FIELD_YLENGTH) / 2) as number,
  constants.BOX18_XLENGTH_TO_FIELD_XLENGTH as number,
  constants.BOX18_YLENGTH_TO_FIELD_YLENGTH as number,
];

export const BOX18B_INITIAL_COORDINATES = [
  (constants.FIELD_INITIAL_XLENGTH - constants.BOX18_XLENGTH_TO_FIELD_XLENGTH) as number,
  ((constants.FIELD_INITIAL_YLENGTH - constants.BOX18_YLENGTH_TO_FIELD_YLENGTH) / 2) as number,
  constants.BOX18_XLENGTH_TO_FIELD_XLENGTH as number,
  constants.BOX18_YLENGTH_TO_FIELD_YLENGTH as number,
];

export const GOAL_ANIMATION_TIME = 180; // in number of `update` calls
export const KICKOFF_ANIMATION_TIME = 180; // in number of `update` calls
export const GAME_OVER_ANIMATION_TIME = 180;

export const FIELD_INITIAL_COORDINATES = [
  constants.FIELD_INITIAL_X as number,
  constants.FIELD_INITIAL_Y as number,
  constants.FIELD_INITIAL_XLENGTH as number,
  constants.FIELD_INITIAL_YLENGTH as number,
];

export enum INPUT_KEY {
  ARROW_DOWN = "ArrowDown",
  ARROW_LEFT = "ArrowLeft",
  ARROW_RIGHT = "ArrowRight",
  ARROW_UP = "ArrowUp",
  KEY_A = "KeyA",
  KEY_D = "KeyD",
  KEY_F = "KeyF",
  KEY_S = "KeyS",
}

export const COMMAND_ID_TO_KEY_COMBINATION: Map<COMMAND_ID, INPUT_KEY[]> =
// The order of the keys in this mapping is important. We want send a shoot
// command once the user presses the shoot key, whether or not they are already
// pressing a direction key.
  new Map([
    [COMMAND_ID.SHOOT_BALL, [INPUT_KEY.KEY_A]],
    [COMMAND_ID.REQUEST_PASS, [INPUT_KEY.KEY_D]],
    [COMMAND_ID.PASS_BALL_DOWN, [INPUT_KEY.ARROW_DOWN,  INPUT_KEY.KEY_S]],
    [COMMAND_ID.PASS_BALL_LEFT, [INPUT_KEY.ARROW_LEFT, INPUT_KEY.KEY_S]],
    [COMMAND_ID.PASS_BALL_RIGHT, [INPUT_KEY.ARROW_RIGHT, INPUT_KEY.KEY_S]],
    [COMMAND_ID.PASS_BALL_UP, [INPUT_KEY.ARROW_UP, INPUT_KEY.KEY_S]],
    [COMMAND_ID.PASS_BALL, [INPUT_KEY.KEY_S]],
    [COMMAND_ID.CHASE_BALL, [INPUT_KEY.KEY_F]],
    [COMMAND_ID.MOVE_PLAYER_LOWER_LEFT, [INPUT_KEY.ARROW_DOWN, INPUT_KEY.ARROW_LEFT]],
    [COMMAND_ID.MOVE_PLAYER_LOWER_RIGHT, [INPUT_KEY.ARROW_DOWN, INPUT_KEY.ARROW_RIGHT]],
    [COMMAND_ID.MOVE_PLAYER_UPPER_LEFT, [INPUT_KEY.ARROW_UP, INPUT_KEY.ARROW_LEFT]],
    [COMMAND_ID.MOVE_PLAYER_UPPER_RIGHT, [INPUT_KEY.ARROW_UP, INPUT_KEY.ARROW_RIGHT]],
    [COMMAND_ID.MOVE_PLAYER_DOWN, [INPUT_KEY.ARROW_DOWN]],
    [COMMAND_ID.MOVE_PLAYER_LEFT, [INPUT_KEY.ARROW_LEFT]],
    [COMMAND_ID.MOVE_PLAYER_RIGHT, [INPUT_KEY.ARROW_RIGHT]],
    [COMMAND_ID.MOVE_PLAYER_UP, [INPUT_KEY.ARROW_UP]],
  ]);

export const PLAYER_INITIAL_ARGS = [
  constants.PLAYER_INITIAL_X as number,
  constants.PLAYER_INITIAL_Y as number,
  constants.PLAYER_INITIAL_VX as number,
  constants.PLAYER_INITIAL_VY as number,
  constants.PLAYER_DEFAULT_SPEED as number,
  constants.PLAYER_DIAMETER_TO_FIELD_YLENGTH as number,
];

export const POSTA_INITIAL_COORDINATES = [
  constants.FIELD_INITIAL_X as number,
  ((constants.FIELD_INITIAL_YLENGTH - constants.POST_YLENGTH_TO_FIELD_YLENGTH) / 2) as number,
  constants.POST_XLENGTH_TO_FIELD_XLENGTH as number,
  constants.POST_YLENGTH_TO_FIELD_YLENGTH as number,
];

export const POSTB_INITIAL_COORDINATES = [
  (constants.FIELD_INITIAL_XLENGTH - constants.POST_XLENGTH_TO_FIELD_XLENGTH) as number,
  ((constants.FIELD_INITIAL_YLENGTH - constants.POST_YLENGTH_TO_FIELD_YLENGTH) / 2) as number,
  constants.POST_XLENGTH_TO_FIELD_XLENGTH as number,
  constants.POST_YLENGTH_TO_FIELD_YLENGTH as number,
];

export enum PLAYER_MESSAGES {
  WAIT = "wait",
  PASS = "pass",
}

export enum TEAM_SIDES {
  LEFT = "left",
  RIGHT = "right",
}

export enum IO_MESSAGE_TYPE {
  COMMAND = "command",
  GAME_STATE = "game.state",
  CLIENT_ASSIGNED_PLAYER = "client.assigned.player",
  EXIT = "exit",
}

export enum PROCESS_MESSAGE_TYPE {
  ASSIGN_CONTROLLER = 0,
  COMMAND = 1,
  GAME_OVER = 2,
  GAME_STATE = 3,
  CONTROLLER_ASSIGNED = 4,
}

export enum PLAYER_ROLE {
  GK = 0,
  LB = 1,
  LCB = 2,
  RCB = 3,
  RB = 4,
  LM = 5,
  LCM = 6,
  RCM = 7,
  RM = 8,
  LF = 9,
  RF = 10,
}

export enum PLAYER_ROLE_TYPE {
  KEEPER = 0,
  DEFENDER = 1,
  MIDFIELDER = 2,
  FORWARD = 3,
}

export const GAME_EXECUTABLE_FILE = "dist/game_executable.js";
export const Y_BALL_MARGIN_FOR_KICKOFF_SUPPORT = constants.PLAYER_DIAMETER_TO_FIELD_YLENGTH * 6;
export const NUM_SHOT_TARGETS = 6;
export const ROLE_TYPE_CHOICE_MAP = new Map([
  ["defender", PLAYER_ROLE_TYPE.DEFENDER],
  ["midfielder", PLAYER_ROLE_TYPE.MIDFIELDER],
  ["forward", PLAYER_ROLE_TYPE.FORWARD],
]);
export const DEFAULT_START_GAME_TIMEOUT = 5000;
export const GAME_STATE_UPDATE_DELAY = 20; // milliseconds
export enum SOUND_ID {
  KICK = 0,
  WHISTLE = 1,
}

export enum PLAYER_ANIMATION_STATE {
  NONE = 0,
  IDLE = 1,
  RUNNING = 2,
  KICKING = 3,
}

export enum TEAM_ID {
  NONE = 0,
  WHITE = 1,
  RED = 2,
}

export enum ANIMATION_ID {
  NONE = 0,
  RED_PLAYER_IDLE = 1,
  WHITE_PLAYER_IDLE = 2,
  RED_PLAYER_RUNNING = 3,
  WHITE_PLAYER_RUNNING = 4,
  RED_PLAYER_KICKING = 5,
  WHITE_PLAYER_KICKING = 6,
  WHITE_PLAYER_IDLE_FLIPPED = 7,
  WHITE_PLAYER_RUNNING_FLIPPED = 8,
  WHITE_PLAYER_KICKING_FLIPPED = 9,
  RED_PLAYER_IDLE_FLIPPED = 10,
  RED_PLAYER_KICKING_FLIPPED = 11,
  RED_PLAYER_RUNNING_FLIPPED = 12,
}

export enum IMAGE_TRANSPOSE_OPERATION_ID {
  NONE = 0,
  FLIP_LEFT_RIGHT = 1,
}

export enum GAME_STATUS {
  NONE = 0,
  IN_PLAY = 1,
  KICKOFF = 2,
  GOAL = 3,
  GAME_OVER = 4,
}

export const DEFAULT_TEAM_A_ROLES = [
  PLAYER_ROLE.GK,
  PLAYER_ROLE.LB,
  PLAYER_ROLE.RB,
  PLAYER_ROLE.LCB,
  PLAYER_ROLE.RCB,
  PLAYER_ROLE.LM,
  PLAYER_ROLE.RM,
  PLAYER_ROLE.LCM,
  PLAYER_ROLE.RCM,
  PLAYER_ROLE.LF,
  PLAYER_ROLE.RF,
];

export const DEFAULT_TEAM_B_ROLES = [
  PLAYER_ROLE.GK,
  PLAYER_ROLE.LB,
  PLAYER_ROLE.RB,
  PLAYER_ROLE.LCB,
  PLAYER_ROLE.RCB,
  PLAYER_ROLE.LM,
  PLAYER_ROLE.RM,
  PLAYER_ROLE.LCM,
  PLAYER_ROLE.RCM,
  PLAYER_ROLE.LF,
  PLAYER_ROLE.RF,
];

export const DEFAULT_PLAYER_STATE_MACHINE_CONFIG: IPlayerStateMachineConfig = {
  attackCongestionWeight: -0.03,
  attackIdealDistanceFromGoal: constants.FIELD_INITIAL_XLENGTH / 3,
  attackProximityToOpposingPostWeight: 0.2,
  attackShotValueWeight: 0.2,
  attackTrackingBallWeight: 0.2,
  congestionRadiusOfInterest: constants.PLAYER_DIAMETER_TO_FIELD_YLENGTH * 5,
  defenceAheadOfBallWeight: 0.2,
  defenceCongestionWeight: -0.1,
  defenceMarkingMargin: constants.PLAYER_DIAMETER_TO_FIELD_YLENGTH * 2.5,
  defenceMarkingWeight: 0.2,
  featureExtractorPositionDelta: constants.PLAYER_DIAMETER_TO_FIELD_YLENGTH * 2.5,
  featureExtractorRefreshInterval: 0,
  shootingStateShotValueThreshold: 0.7,
  // This dictates how long the TeamInControlCalculator should wait while there is
  // no current player in possession, before it changes the teamInPossession to
  // null. Otherwise it leaves the team in possession as the team of the last
  // player that touched the ball.
  teamInControlPossessionTimeOut: 90, // in number of ticks.
};
