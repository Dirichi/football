import { ALL_DIRECTIONS, COMMAND_ID, DIRECTION } from "../constants";
import { Player } from "../game_objects/player";
import { ICommandFactory } from "../interfaces/icommand_factory";
import { ICommandRequest } from "../interfaces/icommand_request";
import { ICommandRequestHandler } from "../interfaces/icommand_request_handler";
import { shotTargetOptions } from "../utils/game_functions";
import { sample } from "../utils/helper_functions";

export class ShootBallRemoteCommandRequestHandler
  implements ICommandRequestHandler {
    private factory: ICommandFactory;

    constructor(factory: ICommandFactory) {
      this.factory = factory;
    }

    public handle(request: ICommandRequest, player: Player): void {
      const command = this.factory.getCommand(COMMAND_ID.SHOOT_BALL);
      // TODO: Shooting at a random position. Update to shoot based on direction
      const target = sample(shotTargetOptions(player));
      command.execute(player, target);
    }
}
