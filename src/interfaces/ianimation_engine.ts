import { IBallSchema } from "./iball_schema";
import { IBoxSchema } from "./ibox_schema";
import { IFieldRegionSchema } from "./ifield_region_schema";
import { IPlayerSchema } from "./iplayer_schema";
import { IPositionValueSchema } from "./iposition_value_schema";
import { IScoresPanelSchema } from "./iscores_panel_schema";
import { ITextSchema } from "./itext_schema";

export interface IAnimationEngine {
  displayPositionValues(values: IPositionValueSchema): void;
  displayText(text: ITextSchema): void;
  drawBall(ball: IBallSchema): void;
  drawBox(box: IBoxSchema): void;
  drawField(field: IBoxSchema): void;
  drawFieldRegion(region: IFieldRegionSchema): void;
  drawPlayer(player: IPlayerSchema): void;
  drawPost(post: IBoxSchema): void;
  drawScoresPanel(panel: IScoresPanelSchema): void;
}
