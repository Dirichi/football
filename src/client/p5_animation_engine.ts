import p5 from "p5";
import { constants } from "../constants";
import { Post } from "../game_objects/post";
import { IAnimationEngine } from "../interfaces/ianimation_engine";
import { IBallSchema } from "../interfaces/iball_schema";
import { IBoxSchema } from "../interfaces/ibox_schema";
import { IFieldRegionSchema } from "../interfaces/ifield_region_schema";
import { IPositionValueSchema } from "../interfaces/iposition_value_schema";
import { IScoresPanelSchema } from "../interfaces/iscores_panel_schema";
import { ITextSchema } from "../interfaces/itext_schema";
import { SpriteImage } from "./sprite_image";

export class P5AnimationEngine implements IAnimationEngine {
  constructor(private animator: p5) { }

  public displayText(text: ITextSchema, size: number = 64) {
    this.animator.push();
    this.animator.textAlign(this.animator.CENTER);
    this.animator.textSize(size);
    this.animator.fill(255);
    this.animator.text(text.value, text.x, text.y);
    this.animator.pop();
  }

  public drawField(field: IBoxSchema) {
    this.animator.push();
    this.animator.fill(0, 200, 0);
    this.animator.rect(field.x, field.y, field.xlength, field.ylength);
    this.drawCenterCircle(field);
    this.drawHalfWayLine(field);
    this.drawBox(field);
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

  public drawScoresPanel(panel: IScoresPanelSchema) {
    this.animator.push();
    this.drawTransparentPanel(panel);
    this.displayTimer(panel);
    this.displayTeamABadge(panel);
    this.displayTeamBBadge(panel);
    this.displayScores(panel);
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

  public displayPositionValues(values: IPositionValueSchema) {
    const currX = values.currentPositionX;
    const currY = values.currentPositionY;
    const potentialPositionsAndValues = values.potentialPositionsAndValues;

    this.animator.push();
    this.animator.stroke(0);
    this.animator.strokeWeight(2);
    potentialPositionsAndValues.forEach((positionText) => {
      this.animator.line(currX, currY, positionText.x, positionText.y);
      this.displayText(positionText, 32);
    });
    this.animator.pop();
  }

  public displayPlayerSpriteCursor(
    cursor: {x: number, y: number, w: number, h: number}): void {
    this.animator.push();
    this.animator.fill(0, 0, 255);
    this.animator.rectMode(this.animator.CENTER);
    this.animator.rect(cursor.x, cursor.y, cursor.w, cursor.h);
    this.animator.pop();
  }

  public drawImage(
    image: SpriteImage, x: number, y: number, w: number, h: number): void {
    this.animator.push();
    this.animator.imageMode(this.animator.CENTER);
    this.animator.image(image.getBaseImage(), x, y, 3 * w, 3 * h);
    this.animator.pop();
  }

  public loadImage(filePath: string): Promise<p5.Image> {
    return new Promise((resolve, reject) => {
      this.animator.loadImage(filePath, (image) => {
        resolve(image);
      }, (error) => {
        reject(error);
      });
    });
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

  private drawTransparentPanel(panel: IScoresPanelSchema) {
    this.animator.push();
    this.animator.fill(96, 125, 139, 128);
    this.animator.rect(panel.x, panel.y, panel.xlength, panel.ylength);
    this.animator.pop();
  }

  private displayTimer(panel: IScoresPanelSchema) {
    const midY = panel.y + panel.ylength / 2;
    this.animator.push();
    this.animator.fill(255);
    this.animator.textAlign(this.animator.CENTER, this.animator.CENTER);
    this.animator.textSize(24);
    this.animator.text(panel.time, panel.x + (panel.xlength * 0.1), midY);
    this.animator.pop();
  }

  private displayScores(panel: IScoresPanelSchema) {
    const midY = panel.y + panel.ylength / 2;
    const scoresText = `${panel.teamAScore} - ${panel.teamBScore}`;
    this.animator.push();
    this.animator.fill(255);
    this.animator.textAlign(this.animator.CENTER, this.animator.CENTER);
    this.animator.textSize(24);
    this.animator.text(scoresText, panel.x + panel.xlength * 0.6, midY);
    this.animator.pop();
  }

  private displayTeamABadge(panel: IScoresPanelSchema) {
    const midY = panel.y + panel.ylength / 2;
    this.animator.push();
    // TODO: These colors are hardcoded and should be passed in from the
    // server perhaps through the IScoresPanelSchema.
    this.animator.fill(0, 0, 255);
    this.animator.circle(panel.x + (panel.xlength * 0.3), midY, panel.xlength * 0.05);
    this.animator.pop();
  }

  private displayTeamBBadge(panel: IScoresPanelSchema) {
    const midY = panel.y + panel.ylength / 2;
    this.animator.push();
    // TODO: These colors are hardcoded and should be passed in from the
    // server perhaps through the IScoresPanelSchema.
    this.animator.fill(255, 0, 0);
    this.animator.circle(panel.x + (panel.xlength * 0.9), midY, panel.xlength * 0.05);
    this.animator.pop();
  }
}
