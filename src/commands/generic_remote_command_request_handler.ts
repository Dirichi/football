import { Player } from "../game_objects/player";
import { ICommandFactory } from "../interfaces/icommand_factory";
import { ICommandRequest } from "../interfaces/icommand_request";
import { ICommandRequestHandler } from "../interfaces/icommand_request_handler";

export class GenericRemoteCommandRequestHandler
  implements ICommandRequestHandler {
    private factory: ICommandFactory;

    constructor(factory: ICommandFactory) {
      this.factory = factory;
    }

    public handle(request: ICommandRequest, player: Player) {
      const command = this.factory.getCommand(request.commandId);
      command.execute(player);
    }
}
