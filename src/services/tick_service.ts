import { EventQueue } from "../event_queue";
import { ITickService } from "../interfaces/itick_service";

export class TickService implements ITickService {
  private tickCount: number;
  private queue: EventQueue;

  constructor(queue: EventQueue) {
    this.queue = queue;
    this.tickCount = 0;
  }

  public tick(): void {
    this.tickCount += 1;
    this.queue.trigger(`tickService.tickCount.${this.tickCount}`, {});
  }

  public after(numberOfTicks: number, callback: () => void): void {
    const deadline = this.tickCount + numberOfTicks + 1;
    this.queue.once(`tickService.tickCount.${deadline}`, callback);
  }

  public every(numberOfTicks: number, callback: () => void): void {
    this.after(numberOfTicks, () => {
      callback.call(this);
      this.every(numberOfTicks, callback);
    });
  }
}
