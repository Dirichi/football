import { ITickService } from "../interfaces/itick_service";
import { EventQueue } from "../event_queue";

export class TickService implements ITickService {
  private tickCount: number;
  private queue: EventQueue;

  constructor(queue: EventQueue) {
    this.queue = queue;
    this.tickCount = 0;
  }

  tick(): void {
    this.tickCount += 1;
    this.queue.trigger(`tickService.tickCount.${this.tickCount}`, {});
  }

  after(numberOfTicks: number, callback: () => void): void {
    const deadline = this.tickCount + numberOfTicks + 1;
    this.queue.once(`tickService.tickCount.${deadline}`, callback);
  }
}
