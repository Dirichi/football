export interface IAnimationEngine {
  // TODO: More thought needs to be given to what actually shows up
  // in this interface.
  circle(xcenter: number, ycenter: number, diameter: number): void;
  push(): void;
  pop(): void;
  fill(r: number, g: number, b: number): void;
}
