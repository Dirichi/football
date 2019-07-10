import { POSITION_DELTA_FOR_POSITION_VALUE_CALCULATION } from "../constants";
import { Player } from "../game_objects/player";
import { IPositionValueSchema } from "../interfaces/iposition_value_schema";
import { ITextSchema } from "../interfaces/itext_schema";
import { PositionValueCalculator } from "../position_value_calculator";
import { Vector3D } from "../three_dimensional_vector";

export class PositionValueDebugService {
  private positionValueCalculator: PositionValueCalculator;
  private players: Player[];
  private enabled: boolean;

  constructor(
    positionValueCalculator: PositionValueCalculator,
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
    const delta = POSITION_DELTA_FOR_POSITION_VALUE_CALCULATION;
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
      const value = this.positionValueCalculator.evaluate(player, position);

      return {
        value: String(value),
        x: position.x,
        y: position.y,
      } as ITextSchema;
    }
}
