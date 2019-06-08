import { EventQueue } from "../../src/event_queue";
import { ITickService } from "../../src/interfaces/itick_service";

export class TestTickService implements ITickService {
  private deadlineToCallBackMapping: Array<[number, () => void]>
  private tickCount: number;

  constructor() {
    this.tickCount = 0;
    this.deadlineToCallBackMapping = [];
  }

  public after(numberOfTicks: number, callback: () => void): void {
    const deadline = this.tickCount + numberOfTicks;
    this.deadlineToCallBackMapping.push([deadline, callback])
  }

  public fastForward(numberOfTicks: number): void {
    this.tickCount += numberOfTicks;
    this.deadlineToCallBackMapping.filter(([tickCount, callback]) => {
      return this.tickCount > tickCount;
    }).forEach(([tickCount, callback]) => callback.call(this));
  }
}
