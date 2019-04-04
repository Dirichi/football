import { IBallSchema } from "./iball_schema";
import { IBoxSchema } from "./ibox_schema";

export interface IAnimationEngine {
  drawBall(ball: IBallSchema): void;
  drawBox(box: IBoxSchema): void;
  drawField(field: IBoxSchema): void;
  drawPost(post: IBoxSchema): void;
}
