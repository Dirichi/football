import { EVENTS } from "../../constants";
import { EventQueue } from "../../event_queue";
import { IAnimationEngine } from "../../interfaces/ianimation_engine";
import { IBoxSchema } from "../../interfaces/ibox_schema";

export class PostGraphics {
  public engine: IAnimationEngine;
  public queue: EventQueue;

  private posts: IBoxSchema[];
  private scale: number[];

  constructor(engine: IAnimationEngine, queue: EventQueue) {
    this.engine = engine;
    this.posts = [];
    this.scale = [0, 0, 1, 1];
    this.queue = queue;
    this.configureListeners();
  }

  public animate() {
    this.posts.forEach((post) => this.engine.drawPost(post));
  }

  public setScale(scale: number[]) {
    this.scale = scale;
  }

  private configureListeners() {
    this.queue.when(EVENTS.POSTS_DATA, (data) => {
      const deserializedData = data as IBoxSchema[];
      this.posts = deserializedData.map((post) => {
        return this.toScale(post);
      });
    });
  }

  private toScale(data: IBoxSchema): IBoxSchema {
    // TODO: Should scaling the gameObject also be a job of the serializer?
    const [xmin, ymin, xmax, ymax] = this.scale;
    const xrange = xmax - xmin;
    const yrange = ymax - ymin;

    return {
      x: (data.x * xrange) + xmin,
      xlength: (data.xlength * xrange),
      y: (data.y * yrange) + ymin,
      ylength: (data.ylength * yrange),
    } as IBoxSchema;
  }
}
