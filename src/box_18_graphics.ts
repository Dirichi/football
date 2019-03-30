import { Box18 } from "./box_18";
import { Field } from "./field";
import { P5AnimationEngine } from "./p5_animation_engine";

export class Box18Graphics {
  // TODO: implement AnimationEngine interface
  public engine: P5AnimationEngine;

  constructor(engine: P5AnimationEngine) {
    this.engine = engine;
  }

  public animate(box: Box18) {
    this.engine.stroke(255, 255, 255);
    this.engine.strokeWeight(4);
    this.engine.rectangle(box.x, box.y, box.xlength, box.ylength);
  }

}
