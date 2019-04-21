import { IBallSchema } from "./iball_schema";
import { IBoxSchema } from "./ibox_schema";
import { IFieldRegionSchema } from "./ifield_region_schema";
import { IPlayerSchema } from "./iplayer_schema";

export interface IAnimationEngine {
  drawBall(ball: IBallSchema): void;
  drawBox(box: IBoxSchema): void;
  drawField(field: IBoxSchema): void;
  drawFieldRegion(region: IFieldRegionSchema): void;
  drawPlayer(player: IPlayerSchema): void;
  drawPost(post: IBoxSchema): void;
}
