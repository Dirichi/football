import { ALL_DIRECTIONS, COMMAND_ID, DIRECTION } from "../constants";
import { Player } from "../game_objects/player";
import { ICommandFactory } from "../interfaces/icommand_factory";
import { ICommandRequest } from "../interfaces/icommand_request";
import { ICommandRequestHandler } from "../interfaces/icommand_request_handler";

export class PassBallRemoteCommandRequestHandler
  implements ICommandRequestHandler {
    private factory: ICommandFactory;

    constructor(factory: ICommandFactory) {
      this.factory = factory;
    }

    public handle(request: ICommandRequest, player: Player): void {
      const direction = this.getDirectionFrom(request.commandId);
      const receiver = this.findReceiver(player, direction);
      const command = this.factory.getCommand(COMMAND_ID.PASS_BALL);
      command.execute(player, receiver);
    }

    private getDirectionFrom(commandId: COMMAND_ID): DIRECTION | null {
      const commandString = commandId as string;
      const directionMatcher = commandString.match(ALL_DIRECTIONS.join("|"));
      if (directionMatcher) {
        return directionMatcher[0] as DIRECTION;
      }
      return null;
    }

    private findReceiver(player: Player, direction: DIRECTION | null): Player {
      // TODO: Calculate the nearest teammate in the provided direction
      return player.getNearestTeamMate();
    }
}
