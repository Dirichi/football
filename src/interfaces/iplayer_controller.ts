export interface IPlayerController {
  update(): void;
  handleMessage(message: {details: string}): void;
  enable(): void;
  disable(): void;
}
