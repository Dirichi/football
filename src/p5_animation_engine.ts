import p5 from "p5";
import { IAnimationEngine } from "./ianimation_engine";

export class P5AnimationEngine implements IAnimationEngine {
  public animator: p5;

  constructor(animator: p5) {
    this.animator = animator;
  }

  public push() {
    this.animator.push();
  }

  public pop() {
    this.animator.pop();
  }

  public line(x1: number, y1: number, x2: number, y2: number) {
    this.animator.line(x1, y1, x2, y2);
  }

  public fill(r: number, g: number, b: number) {
    this.animator.fill(r, g, b);
  }

  public stroke(r: number, g: number, b: number) {
    this.animator.stroke(r, g, b);
  }

  public strokeWeight(weight: number) {
    this.animator.strokeWeight(weight);
  }

  public rectangle(x: number, y: number, xlength: number, ylength: number) {
    this.animator.rect(x, y, xlength, ylength);
  }

  public circle(xcenter: number, ycenter: number, diameter: number) {
    this.animator.ellipse(xcenter, ycenter, diameter);
  }
}
