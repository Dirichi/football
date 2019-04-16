import { EVENTS } from "../constants";
import { EventQueue } from "../event_queue";
import { IAnimationEngine } from "../interfaces/ianimation_engine";
import { IPlayerSchema } from "../interfaces/iplayer_schema";

export class PlayerGraphics {
  public engine: IAnimationEngine;
  public queue: EventQueue;

  private players: IPlayerSchema[];
  private scale: number[];

  constructor(engine: IAnimationEngine, queue: EventQueue) {
    this.engine = engine;
    this.players = [];
    this.queue = queue;
    this.scale = [0, 0, 1, 1]; // default scale
    this.configureListeners();
  }

  public animate() {
    this.players.forEach((player) => this.engine.drawPlayer(player));
  }

  public setScale(scale: number[]) {
    this.scale = scale;
  }

  private configureListeners() {
    this.queue.when(EVENTS.PLAYER_DATA, (data) => {
      const deserializedData = data as IPlayerSchema[];
      this.players = deserializedData.map((player) => this.toScale(player));
    });
  }

  private toScale(data: IPlayerSchema): IPlayerSchema {
    const [xmin, ymin, xmax, ymax] = this.scale;
    const xrange = xmax - xmin;
    const yrange = ymax - ymin;

    return {
      diameter: (data.diameter * yrange),
      vx: data.vx * xrange,
      vy: data.vy * yrange,
      x: (data.x * xrange) + xmin,
      y: (data.y * yrange) + ymin,
    } as IPlayerSchema;
  }
}
