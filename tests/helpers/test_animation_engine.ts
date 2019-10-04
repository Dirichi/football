import { IAnimationEngine } from "../../src/interfaces/ianimation_engine";
import { IBallSchema } from "../../src/interfaces/iball_schema";
import { IBoxSchema } from "../../src/interfaces/ibox_schema";
import { IFieldRegionSchema } from "../../src/interfaces/ifield_region_schema";
import { IPositionValueSchema } from "../../src/interfaces/iposition_value_schema";
import { ITextSchema } from "../../src/interfaces/itext_schema";
import { IScoresPanelSchema } from "../../src/interfaces/iscores_panel_schema";

export class TestAnimationEngine implements IAnimationEngine {
  public displayPositionValues(values: IPositionValueSchema) {};
  public displayText(text: ITextSchema) {};
  public drawBall(ball: IBallSchema) {};
  public drawBox(box: IBoxSchema) {};
  public drawField(field: IBoxSchema) {};
  public drawFieldRegion(region: IFieldRegionSchema) {};
  public drawPost(post: IBoxSchema) {};
  public drawScoresPanel(panel: IScoresPanelSchema) {};
  public displayPlayerSpriteCursor(
    cursor: {x: number, y: number, w: number, h: number}) {};
}
