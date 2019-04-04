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
    this.boxes.forEach((box) => this.engine.drawBox(box));
  }

  public setScale(scale: number[]) {
    this.scale = scale;
  }
}
