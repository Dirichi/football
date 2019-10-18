export interface ITickService {
  after(numberOfTicks: number, callback: () => void): void;
  every(numberOfTicks: number, callback: () => void): void;
}
