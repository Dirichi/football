import { P5AnimationEngine } from "./p5_animation_engine";
import { Post } from "./post";

export class PostGraphics {
  // TODO: implement AnimationEngine interface
  public engine: P5AnimationEngine;

  constructor(engine: P5AnimationEngine) {
    this.engine = engine;
  }

  public animate(post: Post) {
    this.engine.fill(255, 255, 255);
    this.engine.rectangle(post.x, post.y, post.xlength, post.ylength);
  }
}
