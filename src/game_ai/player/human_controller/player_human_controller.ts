import { Player } from "../../../game_objects/player";
import { IPlayerController } from "../../../interfaces/iplayer_controller";

export class PlayerHumanController implements IPlayerController {
  private player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  public update(): void {
    return;
  }

  public handleMessage(message: {details: string}): void {
    return;
  }
}
