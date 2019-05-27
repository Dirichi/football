import { ALL_DIRECTIONS, COMMAND_ID, DIRECTION } from "../constants";
import { Player } from "../game_objects/player";
import { ICommandFactory } from "../interfaces/icommand_factory";
import { ICommandRequest } from "../interfaces/icommand_request";
import { ICommandRequestHandler } from "../interfaces/icommand_request_handler";

export class PassBallRemoteCommandRequestHandler
  implements ICommandRequestHandler {
    private sender: Player;
    private factory: ICommandFactory;

    constructor(sender: Player, factory: ICommandFactory) {
      // TODO: Find a way to extract the sender from the request payload
      this.sender = sender;
      this.factory = factory;
    }

    public handle(request: ICommandRequest): void {
      const direction = this.getDirectionFrom(request.commandId);
      const receiver = this.findReceiver(direction);
      const command = this.factory.getCommand(COMMAND_ID.PASS_BALL);
      command.execute(this.sender, receiver);
    }

    private getDirectionFrom(commandId: COMMAND_ID): DIRECTION | null {
      const commandString = commandId as string;
      const directionMatcher = commandString.match(ALL_DIRECTIONS.join("|"));
      if (directionMatcher) {
        return directionMatcher[0] as DIRECTION;
      }
      return null;
    }

    private findReceiver(direction: DIRECTION | null): Player {
      // TODO: Calculate the nearest teammate in the provided direction
      return this.sender.getNearestTeamMate();
    }
}
