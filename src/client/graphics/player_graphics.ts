import { EVENTS } from "../../constants";
import { EventQueue } from "../../event_queue";
import { IPlayerSchema } from "../../interfaces/iplayer_schema";
import { PlayerSpriteManager } from "../player_sprite_manager";

export class PlayerGraphics {
  public queue: EventQueue;
  private scale: number[];
  private spriteManager: PlayerSpriteManager;

  constructor(
    spriteManager: PlayerSpriteManager,
    queue: EventQueue) {
    this.queue = queue;
    this.scale = [0, 0, 1, 1]; // default scale
    this.spriteManager = spriteManager;
    this.configureListeners();
  }

  public animate() {
    this.spriteManager.animateAll();
  }

  public setScale(scale: number[]) {
    this.scale = scale;
  }

  private configureListeners() {
    this.queue.when(EVENTS.PLAYER_DATA, (data) => {
      const deserializedData = data as IPlayerSchema[];
      const players = deserializedData.map((player) => this.toScale(player));
      players.forEach((player) => this.spriteManager.createOrUpdate(player));
    });
  }

  private toScale(data: IPlayerSchema): IPlayerSchema {
    const [xmin, ymin, xmax, ymax] = this.scale;
    const xrange = xmax - xmin;
    const yrange = ymax - ymin;

    return {
      diameter: (data.diameter * yrange),
      id: data.id,
      teamId: data.teamId,
      vx: data.vx * xrange,
      vy: data.vy * yrange,
      x: (data.x * xrange) + xmin,
      y: (data.y * yrange) + ymin,
    } as IPlayerSchema;
  }
}
