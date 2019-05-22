import { EVENTS } from "../constants";
import { EventQueue } from "../event_queue";
import { IAnimationEngine } from "../interfaces/ianimation_engine";
import { IScoresPanelSchema } from "../interfaces/iscores_panel_schema";

export class ScoresPanelGraphics {
  public engine: IAnimationEngine;
  public queue: EventQueue;

  private panel?: IScoresPanelSchema;
  private scale: number[];

  constructor(engine: IAnimationEngine, queue: EventQueue) {
    this.engine = engine;
    this.scale = [0, 0, 1, 1];
    this.queue = queue;
    this.configureListeners();
  }

  public animate() {
    if (this.panel) {
      this.engine.drawScoresPanel(this.panel);
    }
  }

  public setScale(scale: number[]) {
    this.scale = scale;
  }

  private configureListeners() {
    this.queue.when(EVENTS.SCORES_PANEL_DATA, (data) => {
      const deserializedData = data as IScoresPanelSchema;
      this.panel = this.toScale(deserializedData);
    });
  }

  private toScale(data: IScoresPanelSchema): IScoresPanelSchema {
    const [xmin, ymin, xmax, ymax] = this.scale;
    const xrange = xmax - xmin;
    const yrange = ymax - ymin;

    return {
      teamAScore: data.teamAScore,
      teamBScore: data.teamBScore,
      time: data.time,
      x: (data.x * xrange) + xmin,
      xlength: (data.xlength * xrange),
      y: (data.y * yrange) + ymin,
      ylength: (data.ylength * yrange),
    } as IScoresPanelSchema;
  }
}
