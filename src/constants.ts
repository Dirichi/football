export enum constants {
  BALL_DIAMETER_TO_FIELD_YLENGTH = 0.01,
  BALL_DEFAULT_SPEED = 0.002,
  BALL_INITIAL_VX = 0,
  BALL_INITIAL_VY = 0,
  BALL_INITIAL_X = 0.6,
  BALL_INITIAL_Y = 0.6,
  BOX6_XLENGTH_TO_FIELD_XLENGTH = 0.06,
  BOX6_YLENGTH_TO_FIELD_YLENGTH = 0.28,
  BOX18_XLENGTH_TO_FIELD_XLENGTH = 0.17,
  BOX18_YLENGTH_TO_FIELD_YLENGTH = 0.58,
  CENTER_CIRCLE_DIAMETER_TO_FIELD_XLENGTH = 0.2,
  FIELD_INITIAL_X = 0,
  FIELD_INITIAL_Y = 0,
  FIELD_INITIAL_XLENGTH = 1,
  FIELD_INITIAL_YLENGTH = 1,
  PLAYER_DIAMETER_TO_FIELD_YLENGTH = 0.03,
  PLAYER_INITIAL_VX = 0,
  PLAYER_INITIAL_VY = 0,
  PLAYER_INITIAL_X = 0.3,
  PLAYER_INITIAL_Y = 0.8,
  PLAYER_DEFAULT_SPEED = 0.001,
  POST_XLENGTH_TO_FIELD_XLENGTH = 0.01,
  POST_YLENGTH_TO_FIELD_YLENGTH = 0.15,
}

export enum EVENTS {
  BALL_DATA = "ball.data",
  BOXES_DATA = "boxes.data",
  FIELD_DATA = "field.data",
  PLAYER_DATA = "player.data",
  POSTS_DATA = "posts.data",
  STATE_CHANGED = "state.changed",
}

export enum COMMANDS {
  CHASE_BALL = "chase.ball",
  MOVE_PLAYER_LEFT = "move.player.left",
  MOVE_PLAYER_DOWN = "move.player.down",
  MOVE_PLAYER_RIGHT = "move.player.right",
  MOVE_PLAYER_UP = "move.player.up",
  PASS_BALL = "pass.ball",
  SHOOT_BALL = "shoot.ball",
  STOP = "player.stop",
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

export const FIELD_INITIAL_COORDINATES = [
  constants.FIELD_INITIAL_X as number,
  constants.FIELD_INITIAL_Y as number,
  constants.FIELD_INITIAL_XLENGTH as number,
  constants.FIELD_INITIAL_YLENGTH as number,
];

export const KEY_DOWN_EVENT_TO_COMMAND_MAP: Map<string, COMMANDS> = new Map([
  ["ArrowDown", COMMANDS.MOVE_PLAYER_DOWN],
  ["ArrowLeft", COMMANDS.MOVE_PLAYER_LEFT],
  ["ArrowRight", COMMANDS.MOVE_PLAYER_RIGHT],
  ["ArrowUp", COMMANDS.MOVE_PLAYER_UP],
  ["KeyA", COMMANDS.SHOOT_BALL],
  ["KeyF", COMMANDS.CHASE_BALL],
  ["KeyS", COMMANDS.PASS_BALL],
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
