export interface ITickService {
  after(numberOfTicks: number, callback: () => void): void;
}
