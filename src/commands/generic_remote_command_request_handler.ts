import { Player } from "../game_objects/player";
import { ICommandFactory } from "../interfaces/icommand_factory";
import { ICommandRequest } from "../interfaces/icommand_request";
import { ICommandRequestHandler } from "../interfaces/icommand_request_handler";

export class GenericRemoteCommandRequestHandler
  implements ICommandRequestHandler {
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
