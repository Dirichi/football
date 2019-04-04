import { Box } from "./box";
import { IBallSchema } from "./iball_schema";
import { IBoxSchema } from "./ibox_schema";
import { Post } from "./post";

export interface IAnimationEngine {
  // TODO: More thought needs to be given to what actually shows up
  // in this interface.

  drawBall(ball: IBallSchema): void;
  drawBox(box: Box): void;
  drawField(field: IBoxSchema): void;
  drawPost(post: Post): void;
}
