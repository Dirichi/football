import { COMMANDS } from "../../../constants";
import { IPlayerState } from "../../../interfaces/iplayer_state";
import { ICommandFactory } from "../../../interfaces/icommand_factory";
import { Player } from "../../../game_objects/player";

export class Passing implements IPlayerState {
  private commandFactory: ICommandFactory;

  constructor(commandFactory: ICommandFactory) {
    this.commandFactory = commandFactory;
  }

  public eligibleFor(player: Player): boolean {
    return player.hasBall() && player.inGoodShootingPosition();
  }

  public update(player: Player): void {
    if (this.eligibleFor(player)) {
      this.commandFactory.getCommand(COMMANDS.SHOOT_BALL).execute(player);
    }
  }
}
