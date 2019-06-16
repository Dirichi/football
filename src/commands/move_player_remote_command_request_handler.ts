import { COMMAND_ID } from "../constants";
import { Player } from "../game_objects/player";
import { ICommandFactory } from "../interfaces/icommand_factory";
import { ICommandRequest } from "../interfaces/icommand_request";
import { ICommandRequestHandler } from "../interfaces/icommand_request_handler";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class MovePlayerRemoteCommandRequestHandler
  implements ICommandRequestHandler {
    private factory: ICommandFactory;
    private commandIdToDirectionMapping:
      Map<COMMAND_ID, ThreeDimensionalVector>;

    constructor(factory: ICommandFactory) {
      this.factory = factory;
      this.commandIdToDirectionMapping = new Map([
        [COMMAND_ID.MOVE_PLAYER_UP, new ThreeDimensionalVector(0, -1, 0)],
        [COMMAND_ID.MOVE_PLAYER_UPPER_LEFT,
          new ThreeDimensionalVector(-1, -1, 0)],
        [COMMAND_ID.MOVE_PLAYER_UPPER_RIGHT,
          new ThreeDimensionalVector(1, -1, 0)],
        [COMMAND_ID.MOVE_PLAYER_DOWN, new ThreeDimensionalVector(0, 1, 0)],
        [COMMAND_ID.MOVE_PLAYER_LOWER_LEFT,
          new ThreeDimensionalVector(-1, 1, 0)],
        [COMMAND_ID.MOVE_PLAYER_LOWER_RIGHT,
          new ThreeDimensionalVector(1, 1, 0)],
        [COMMAND_ID.MOVE_PLAYER_LEFT, new ThreeDimensionalVector(-1, 0, 0)],
        [COMMAND_ID.MOVE_PLAYER_RIGHT, new ThreeDimensionalVector(1, 0, 0)],
      ]);
    }

    public handle(request: ICommandRequest, player: Player): void {
      const commandId = request.commandId;
      const direction = this.commandIdToDirectionMapping.get(commandId);
      this.factory.getCommand(COMMAND_ID.MOVE).execute(player, direction);
    }
}
