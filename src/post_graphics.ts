import { P5AnimationEngine } from "./p5_animation_engine";
import { Post } from "./post";

export class PostGraphics {
  // TODO: implement AnimationEngine interface
  public engine: P5AnimationEngine;

  private posts: Post[];
  private scale: number[];

  constructor(engine: P5AnimationEngine) {
    this.engine = engine;
    this.posts = [];
    this.scale = [0, 0, 1, 1];
  }

  public animate() {
    this.posts.forEach((post) => this.engine.drawPost(post));
  }

  public setScale(scale: number[]) {
    this.scale = scale;
  }
}
