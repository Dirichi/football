import { Box6 } from "./box_6";
import { Field } from "./field";
import { P5AnimationEngine } from "./p5_animation_engine";

export class Box6Graphics {
  // TODO: implement AnimationEngine interface
  public engine: P5AnimationEngine;

  constructor(engine: P5AnimationEngine) {
    this.engine = engine;
  }

  public animate(box: Box6) {
    this.engine.stroke(255, 255, 255);
    this.engine.strokeWeight(4);
    this.engine.rectangle(box.x, box.y, box.xlength, box.ylength);
  }

}
