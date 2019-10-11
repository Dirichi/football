import { ICollidable } from "../../src/interfaces/icollidable";
import { Shape } from "../../src/custom_types/types";

export class TestCollidable implements ICollidable {
  private gameObjectId: string;
  private shape?: Shape;

  constructor(gameObjectId: string) {
    this.gameObjectId = gameObjectId;
  }

  public getGameObjectId(): string {
    return this.gameObjectId;
  }

  public getShape(): Shape | null {
    const shape = this.shape || null;
    return this.shape;
  }

  public setShape(shape: Shape) {
    this.shape = shape;
  }
}
