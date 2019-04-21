import p5 from "p5";
import { constants } from "../constants";
import { Box } from "../game_objects/box";
import { Post } from "../game_objects/post";
import { IAnimationEngine } from "../interfaces/ianimation_engine";
import { IBallSchema } from "../interfaces/iball_schema";
import { IBoxSchema } from "../interfaces/ibox_schema";
import { IFieldRegionSchema } from "../interfaces/ifield_region_schema";
import { IPlayerSchema } from "../interfaces/iplayer_schema";

export class P5AnimationEngine implements IAnimationEngine {
  public animator: p5;

  constructor(animator: p5) {
    this.animator = animator;
  }

  public drawField(field: IBoxSchema) {
    this.animator.push();
    this.animator.fill(0, 0, 0);
    this.animator.rect(field.x, field.y, field.xlength, field.ylength);
    this.drawCenterCircle(field);
    this.drawHalfWayLine(field);
    this.animator.pop();
  }

  public drawBox(box: IBoxSchema) {
    this.animator.push();
    this.animator.stroke(255, 255, 255);
    this.animator.noFill();
    this.animator.strokeWeight(4);
    this.animator.rect(box.x, box.y, box.xlength, box.ylength);
    this.animator.pop();
  }

  public drawFieldRegion(region: IFieldRegionSchema) {
    this.animator.push();
    this.animator.stroke(200, 0, 200);
    this.animator.noFill();
    this.animator.strokeWeight(4);
    this.animator.rect(region.x, region.y, region.xlength, region.ylength);
    this.animator.textSize(20);
    this.animator.noStroke();
    this.animator.fill(255);
    const midPointX = region.x + (region.xlength / 2);
    const midPointY = region.y + (region.ylength / 2);
    this.animator.text(region.id, midPointX, midPointY);
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

  public drawPlayer(player: IPlayerSchema) {
    this.animator.push();
    this.animator.fill(player.colors);
    this.animator.circle(player.x, player.y, player.diameter);
    this.animator.pop();
  }

  private drawCenterCircle(field: IBoxSchema) {
    this.animator.push();
    this.animator.stroke(255, 255, 255);
    this.animator.strokeWeight(4);
    this.animator.noFill();
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
    this.animator.noFill();
    const midPointX = field.x + (field.xlength / 2);
    this.animator.line(midPointX, field.y, midPointX, (field.y + field.ylength));
    this.animator.pop();
  }
}
