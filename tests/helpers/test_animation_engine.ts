import { Box } from "../../src/box";
import { IAnimationEngine } from "../../src/ianimation_engine";
import { IBallSchema } from "../../src/iball_schema";
import { IBoxSchema } from "../../src/ibox_schema";
import { Post } from "../../src/post";

export class TestAnimationEngine implements IAnimationEngine {
  public drawBall(ball: IBallSchema) {};
  public drawBox(box: Box) {};
  public drawField(field: IBoxSchema) {};
  public drawPost(post: Post) {};
}
