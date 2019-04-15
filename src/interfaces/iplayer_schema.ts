export interface IPlayerSchema {
  x: number;
  y: number;
  vx: number;
  vy: number;
  // TODO: this piece of data may not need to be streamed everytime. Consier
  // removing.
  diameter: number;
}
