export class TimerService {
  private elapsedTime: number;
  private timeStep: number;
  private paused: boolean;
  private stopTime: number;

  constructor(elapsedTime: number, timeStep: number, stopTime: number) {
    this.elapsedTime = elapsedTime;
    this.timeStep = timeStep;
    this.stopTime = stopTime;
    this.paused = false;
  }

  public update(): void {
    if (this.paused || this.isFinished()) { return; }
    this.elapsedTime += this.timeStep;
  }

  public getElapsedTime(): number {
    return this.elapsedTime;
  }

  public isFinished(): boolean {
    return this.elapsedTime >= this.stopTime;
  }

  public pause(): void {
    this.paused = true;
  }

  public play(): void {
    this.paused = false;
  }
}
