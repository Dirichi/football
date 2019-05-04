import { Player } from "../game_objects/player";
import { ICommandFactory } from "../interfaces/icommand_factory";
import { ICommandHandler } from "../interfaces/icommand_handler";
import { ICommandRequest } from "../interfaces/icommand_request";

export class GenericCommandHandler implements ICommandHandler {
  private player: Player;
  private factory: ICommandFactory;

  constructor(player: Player, factory: ICommandFactory) {
    this.player = player;
    this.factory = factory;
  }

  public handle(request: ICommandRequest) {
    const command = this.factory.getCommand(request.commandId);
    command.execute(this.player);
  }
}
