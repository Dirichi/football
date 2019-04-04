import { Box } from "./box";
import { IBallSchema } from "./iball_schema";
import { IBoxSchema } from "./ibox_schema";
import { Post } from "./post";

export interface IAnimationEngine {
  drawBall(ball: IBallSchema): void;
  drawBox(box: Box): void;
  drawField(field: IBoxSchema): void;
  drawPost(post: Post): void;
}
