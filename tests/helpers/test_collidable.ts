import { ICollidable } from "../../src/interfaces/icollidable";

export class TestCollidable implements ICollidable {
  private gameObjectId: string;
  private shape: string;

  constructor(gameObjectId: string, shape: string) {
    this.gameObjectId = gameObjectId;
    this.shape = shape;
  }

  public getGameObjectId(): string {
    return this.gameObjectId;
  }

  public getShape(): string {
    return this.shape;
  }
}
