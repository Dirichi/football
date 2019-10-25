import { PLAYER_MESSAGES } from "../constants";
import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";

export class CallForBallCommand implements ICommand {
  public execute(player: Player): void {
    const teamMateInPossession =
      player.teamMates().find((mate) => mate.hasBall());
    if (!teamMateInPossession) { return; }

    player.sendMessage(teamMateInPossession, PLAYER_MESSAGES.PASS);
  }
}
