import { IAnimationEngine } from "../../src/ianimation_engine";
import { IBallSchema } from "../../src/iball_schema";
import { IBoxSchema } from "../../src/ibox_schema";
import { IPlayerSchema } from "../../src/iplayer_schema";

export class TestAnimationEngine implements IAnimationEngine {
  public drawBall(ball: IBallSchema) {};
  public drawBox(box: IBoxSchema) {};
  public drawField(field: IBoxSchema) {};
  public drawPost(post: IBoxSchema) {};
  public drawPlayer(player: IPlayerSchema) {};
}
