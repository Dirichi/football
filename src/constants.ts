export enum constants {
  BALL_DIAMETER_TO_FIELD_YLENGTH = 0.02,
  BALL_INITIAL_VX = 0.002,
  BALL_INITIAL_VY = 0.002,
  BALL_INITIAL_X = 0.5,
  BALL_INITIAL_Y = 0.5,
  BOX6_XLENGTH_TO_FIELD_XLENGTH = 0.06,
  BOX6_YLENGTH_TO_FIELD_YLENGTH = 0.28,
  BOX18_XLENGTH_TO_FIELD_XLENGTH = 0.17,
  BOX18_YLENGTH_TO_FIELD_YLENGTH = 0.58,
  CENTER_CIRCLE_DIAMETER_TO_FIELD_XLENGTH = 0.2,
  FIELD_INITIAL_X = 0,
  FIELD_INITIAL_Y = 0,
  FIELD_INITIAL_XLENGTH = 1,
  FIELD_INITIAL_YLENGTH = 1,
  POST_XLENGTH_TO_FIELD_XLENGTH = 0.01,
  POST_YLENGTH_TO_FIELD_YLENGTH = 0.15,
}

export enum EVENTS {
  BALL_DATA = "ball.data",
  BOXES_DATA = "boxes.data",
  FIELD_DATA = "field.data",
  POSTS_DATA = "posts.data",
  STATE_CHANGED = "state.changed",
}

export const BALL_INITIAL_ARGS: number[] = [
  constants.BALL_INITIAL_X as number,
  constants.BALL_INITIAL_Y as number,
  constants.BALL_INITIAL_VX as number,
  constants.BALL_INITIAL_VY as number,
  constants.BALL_DIAMETER_TO_FIELD_YLENGTH as number,
];

export const BOX6A_INITIAL_COORDINATES: number[] = [
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
