import { Field } from "./field";
import { P5AnimationEngine } from "./p5_animation_engine";

export class FieldGraphics {
  // TODO: implement AnimationEngine interface
  public engine: P5AnimationEngine;

  constructor(engine: P5AnimationEngine) {
    this.engine = engine;
  }

  public animate(field: Field) {
    this.engine.fill(0, 255, 0);
    this.engine.rectangle(field.x, field.y, field.xlength, field.ylength);
    this.animateCenterCircle(field);
    this.animateHalfWayLine(field);
  }

  private animateCenterCircle(field: Field) {
    this.engine.stroke(255, 255, 255);
    this.engine.strokeWeight(4);
    const midPointX = field.x + (field.xlength / 2);
    const midPointY = field.y + (field.ylength / 2);
    const diameter = field.xlength * 0.2;
    this.engine.circle(midPointX, midPointY, diameter);
  }

  private animateHalfWayLine(field: Field) {
    this.engine.stroke(255, 255, 255);
    this.engine.strokeWeight(4);
    const midPointX = field.x + (field.xlength / 2);
    this.engine.line(midPointX, field.y, midPointX, (field.y + field.ylength));
  }
}
