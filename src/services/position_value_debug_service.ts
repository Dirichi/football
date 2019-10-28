import { DEFAULT_PLAYER_STATE_MACHINE_CONFIG } from "../constants";
import { Player } from "../game_objects/player";
import { IAttackPositionValueCalculator } from "../interfaces/iattack_position_value_calculator";
import { IPositionValueSchema } from "../interfaces/iposition_value_schema";
import { ITextSchema } from "../interfaces/itext_schema";
import { Vector3D } from "../three_dimensional_vector";
import { round } from "../utils/helper_functions";

export class PositionValueDebugService {
  private positionValueCalculator: IAttackPositionValueCalculator;
  private players: Player[];
  private enabled: boolean;

  constructor(
    positionValueCalculator: IAttackPositionValueCalculator,
    players: Player[],
    enabled: boolean = false) {
      this.positionValueCalculator = positionValueCalculator;
      this.players = players;
      this.enabled = enabled;
  }

  public getDebugData(): IPositionValueSchema[] {
    if (!this.enabled) { return [] as IPositionValueSchema[]; }

    return this.players.map((player) => {
      return this.buildPositionValues(player);
    });
  }

  private buildPositionValues(player: Player): IPositionValueSchema {
    const delta =
      DEFAULT_PLAYER_STATE_MACHINE_CONFIG.featureExtractorPositionDelta;
    const potentialPositionDiffs = [
      new Vector3D(0, 0, 0),
      new Vector3D(delta, 0, 0),
      new Vector3D(-delta, 0, 0),
      new Vector3D(0, delta, 0),
      new Vector3D(0, -delta, 0),
    ];

    const potentialPositionsAndValues = potentialPositionDiffs.map((diff) => {
      const potentialPosition = player.getPosition().add(diff);
      return this.buildPositionTextSchema(player, potentialPosition);
    });

    return {
      currentPositionX: player.getPosition().x,
      currentPositionY: player.getPosition().y,
      potentialPositionsAndValues,
    } as IPositionValueSchema;
  }

  private buildPositionTextSchema(
    player: Player, position: Vector3D): ITextSchema {
      let value = this.positionValueCalculator.evaluate(player, position);
      value = round(value, 2);

      return {
        value: String(value),
        x: position.x,
        y: position.y,
      } as ITextSchema;
    }
}
