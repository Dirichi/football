import { IAnimationEngine } from "../../src/interfaces/ianimation_engine";
import { IBallSchema } from "../../src/interfaces/iball_schema";
import { IBoxSchema } from "../../src/interfaces/ibox_schema";
import { IFieldRegionSchema } from "../../src/interfaces/ifield_region_schema";
import { IPlayerSchema } from "../../src/interfaces/iplayer_schema";
import { ITextSchema } from "../../src/interfaces/itext_schema";
import { IScoresPanelSchema } from "../../src/interfaces/iscores_panel_schema";

export class TestAnimationEngine implements IAnimationEngine {
  public displayText(text: ITextSchema) {};
  public drawBall(ball: IBallSchema) {};
  public drawBox(box: IBoxSchema) {};
  public drawField(field: IBoxSchema) {};
  public drawFieldRegion(region: IFieldRegionSchema) {};
  public drawPlayer(player: IPlayerSchema) {};
  public drawPost(post: IBoxSchema) {};
  public drawScoresPanel(panel: IScoresPanelSchema) {};
}
