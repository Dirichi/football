import { Box } from "./box";
import { Field } from "./field";
import { P5AnimationEngine } from "./p5_animation_engine";

export class HollowBoxGraphics {
  // TODO: implement AnimationEngine interface
  public engine: P5AnimationEngine;

  private boxes: Box[];
  private scale: number[];

  constructor(engine: P5AnimationEngine) {
    this.engine = engine;
    this.boxes = [];
    this.scale = [0, 0, 1, 1];
  }

  public animate() {
    this.engine.push();
    this.boxes.forEach((box) => this.animateBox(box));
    this.engine.pop();
  }

  public setScale(scale: number[]) {
    this.scale = scale;
  }

  private animateBox(box: Box) {
    this.engine.stroke(255, 255, 255);
    this.engine.strokeWeight(4);
    this.engine.rectangle(box.x, box.y, box.xlength, box.ylength);
  }
}
