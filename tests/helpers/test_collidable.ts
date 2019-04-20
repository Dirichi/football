import { ICollidable } from "../../src/interfaces/icollidable";
import { Shape } from "../../src/custom_types/shape";

export class TestCollidable implements ICollidable {
  private gameObjectId: string;
  private shapeData?: Shape;

  constructor(gameObjectId: string) {
    this.gameObjectId = gameObjectId;
  }

  public getGameObjectId(): string {
    return this.gameObjectId;
  }

  public getShape(): Shape | null {
    const shape = this.shapeData || null;
    return this.shapeData;
  }

  public setShapeData(shape: Shape) {
    this.shapeData = shape;
  }
}
