export interface IPlayerController {
  update(): void;
  handleMessage(message: {details: string}): void;
}
