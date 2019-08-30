import p5 from "p5";
import { IAnimation } from "../interfaces/ianimation";
import { P5AnimationEngine } from "./p5_animation_engine";

export class SpriteAnimation implements IAnimation {
  constructor(
    private engine: P5AnimationEngine,
    private images: p5.Image[],
    private loop: boolean,
    private speed: number,
    private currentIndex: number = 0) {}

  public render(x: number, y: number, w: number, h: number): void {
    if (this.currentIndex >= this.images.length) {
      this.currentIndex = this.loop ? 0 : this.images.length - 1;
    }
    const imageIndex = Math.floor(this.currentIndex);
    this.engine.drawImage(this.images[imageIndex], x, y, w, h);
    this.currentIndex += this.speed;
  }

  public reset(): void {
    this.currentIndex = 0;
  }

  public copy(): SpriteAnimation {
    return new SpriteAnimation(
      this.engine, this.images, this.loop, this.speed, this.currentIndex);
  }
}
