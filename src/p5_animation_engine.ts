import p5 from "p5";
import { Box } from "./box";
import { constants } from "./constants";
import { IAnimationEngine } from "./ianimation_engine";
import { IBallSchema } from "./iball_schema";
import { IBoxSchema } from "./ibox_schema";
import { Post } from "./post";

export class P5AnimationEngine implements IAnimationEngine {
  public animator: p5;

  constructor(animator: p5) {
    this.animator = animator;
  }

  public drawField(field: IBoxSchema) {
    // Don't push / pop on the field so that it can perpetually be drawn
    // over hollow elements.
    this.animator.fill(0, 0, 0);
    this.animator.rect(field.x, field.y, field.xlength, field.ylength);
    this.drawCenterCircle(field);
    this.drawHalfWayLine(field);
  }

  public drawBox(box: Box) {
    this.animator.push();
    this.animator.stroke(255, 255, 255);
    this.animator.strokeWeight(4);
    this.animator.rect(box.x, box.y, box.xlength, box.ylength);
    this.animator.pop();
  }

  public drawPost(post: Post) {
    this.animator.push();
    this.animator.fill(255, 255, 255);
    this.animator.rect(post.x, post.y, post.xlength, post.ylength);
    this.animator.pop();
  }

  public drawBall(ball: IBallSchema) {
    this.animator.push();
    this.animator.fill(200, 200, 200);
    this.animator.circle(ball.x, ball.y, ball.diameter);
    this.animator.pop();
  }

  private drawCenterCircle(field: IBoxSchema) {
    this.animator.push();
    this.animator.stroke(255, 255, 255);
    this.animator.strokeWeight(4);
    const midPointX = field.x + (field.xlength / 2);
    const midPointY = field.y + (field.ylength / 2);
    const diameter =
      field.xlength * constants.CENTER_CIRCLE_DIAMETER_TO_FIELD_XLENGTH;
    this.animator.circle(midPointX, midPointY, diameter);
    this.animator.pop();
  }

  private drawHalfWayLine(field: IBoxSchema) {
    this.animator.push();
    this.animator.stroke(255, 255, 255);
    this.animator.strokeWeight(4);
    const midPointX = field.x + (field.xlength / 2);
    this.animator.line(midPointX, field.y, midPointX, (field.y + field.ylength));
    this.animator.pop();
  }
}
