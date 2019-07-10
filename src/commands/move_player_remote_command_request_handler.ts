import { COMMAND_ID } from "../constants";
import { Player } from "../game_objects/player";
import { ICommandFactory } from "../interfaces/icommand_factory";
import { ICommandRequest } from "../interfaces/icommand_request";
import { ICommandRequestHandler } from "../interfaces/icommand_request_handler";
import { Vector3D } from "../three_dimensional_vector";

const COMMAND_ID_TO_DIRECTION_MAPPING: Map<COMMAND_ID, Vector3D> =
  new Map([
    [COMMAND_ID.MOVE_PLAYER_UP, new Vector3D(0, -1, 0)],
    [COMMAND_ID.MOVE_PLAYER_UPPER_LEFT, new Vector3D(-1, -1, 0)],
    [COMMAND_ID.MOVE_PLAYER_UPPER_RIGHT, new Vector3D(1, -1, 0)],
    [COMMAND_ID.MOVE_PLAYER_DOWN, new Vector3D(0, 1, 0)],
    [COMMAND_ID.MOVE_PLAYER_LOWER_LEFT, new Vector3D(-1, 1, 0)],
    [COMMAND_ID.MOVE_PLAYER_LOWER_RIGHT, new Vector3D(1, 1, 0)],
    [COMMAND_ID.MOVE_PLAYER_LEFT, new Vector3D(-1, 0, 0)],
    [COMMAND_ID.MOVE_PLAYER_RIGHT, new Vector3D(1, 0, 0)],
  ]);

export class MovePlayerRemoteCommandRequestHandler
  implements ICommandRequestHandler {
    private factory: ICommandFactory;
    private commandIdToDirectionMapping:
      Map<COMMAND_ID, Vector3D>;

    constructor(factory: ICommandFactory) {
      this.factory = factory;
      this.commandIdToDirectionMapping = COMMAND_ID_TO_DIRECTION_MAPPING;
    }

    public handle(request: ICommandRequest, player: Player): void {
      const commandId = request.commandId;
      const direction = this.commandIdToDirectionMapping.get(commandId);
      this.factory.getCommand(COMMAND_ID.MOVE).execute(player, direction);
    }
}
