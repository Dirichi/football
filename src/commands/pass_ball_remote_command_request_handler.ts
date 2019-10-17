import { ALL_DIRECTIONS, COMMAND_ID, DIRECTION } from "../constants";
import { Player } from "../game_objects/player";
import { ICommandFactory } from "../interfaces/icommand_factory";
import { ICommandRequest } from "../interfaces/icommand_request";
import { ICommandRequestHandler } from "../interfaces/icommand_request_handler";
import { Vector3D } from "../three_dimensional_vector";
import { minimumBy } from "../utils/helper_functions";

export class PassBallRemoteCommandRequestHandler
  implements ICommandRequestHandler {

  constructor(
    private factory: ICommandFactory) {}

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
    if (direction == null) {
      return player.getNearestTeamMate();
    }
    const directionAngle = this.getAngleFromDirection(direction);
    return minimumBy(player.teamMates(), (mate) => {
      const angleToMate = this.getAngleToTeamMate(player, mate);
      return Math.abs(angleToMate - directionAngle);
    });
  }

  private getAngleToTeamMate(player: Player, mate: Player): number {
    const directionVector =
      mate.getPosition().minus(player.getPosition());
    const angleToMate = directionVector.angleTo(new Vector3D(1, 0, 0));
    return angleToMate < 0 ? (Math.PI * 2) + angleToMate : angleToMate;
  }

  private getAngleFromDirection(direction: DIRECTION): number {
    const mapping: Map<DIRECTION, number> =
      new Map([
        [DIRECTION.UP, 0], // 0 degrees
        [DIRECTION.RIGHT, Math.PI / 2], // 90 degrees
        [DIRECTION.DOWN, Math.PI], // 180 degrees
        [DIRECTION.LEFT, 3 * Math.PI / 2] // 270 degrees / -90 degrees
      ]);
    return mapping.get(direction);
  }
}
