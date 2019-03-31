import { Box } from "./box";
import { Field } from "./field";
import { P5AnimationEngine } from "./p5_animation_engine";

export class HollowBoxGraphics {
  // TODO: implement AnimationEngine interface
  public engine: P5AnimationEngine;

  constructor(engine: P5AnimationEngine) {
    this.engine = engine;
  }

  public animate(box: Box) {
    this.engine.push();
    this.engine.stroke(255, 255, 255);
    this.engine.strokeWeight(4);
    this.engine.rectangle(box.x, box.y, box.xlength, box.ylength);
    this.engine.pop();
  }
}
