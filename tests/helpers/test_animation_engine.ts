import { IAnimationEngine } from "../../src/interfaces/ianimation_engine";
import { IBallSchema } from "../../src/interfaces/iball_schema";
import { IBoxSchema } from "../../src/interfaces/ibox_schema";
import { IPlayerSchema } from "../../src/interfaces/iplayer_schema";

export class TestAnimationEngine implements IAnimationEngine {
  public drawBall(ball: IBallSchema) {};
  public drawBox(box: IBoxSchema) {};
  public drawField(field: IBoxSchema) {};
  public drawPost(post: IBoxSchema) {};
  public drawPlayer(player: IPlayerSchema) {};
}
