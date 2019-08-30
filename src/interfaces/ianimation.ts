export interface IAnimation {
  render(x: number, y: number, w: number, h: number): void;
  reset(): void;
  copy(): IAnimation;
}
