import { IAnimationEngine } from "./ianimation_engine";
import { Post } from "./post";

export class PostGraphics {
  public engine: IAnimationEngine;

  private posts: Post[];
  private scale: number[];

  constructor(engine: IAnimationEngine) {
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
