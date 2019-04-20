import { EventQueue } from "../event_queue";
import { ICircle } from "../interfaces/icircle";
import { ICollidable } from "../interfaces/icollidable";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class CollisionDetectionService {
  public isColliding(collidableA: ICollidable, collidableB: ICollidable): boolean {
    const shapeA = collidableA.getShape();
    const shapeB = collidableB.getShape();

    if (shapeA.kind === "circle" && shapeB.kind === "circle") {
      return this.cicleCircleColliding(shapeA, shapeB);
    }

    throw new Error(`Unexpected shape kinds ${shapeA.kind}, ${shapeB.kind}`);
  }

  private cicleCircleColliding(circleA: ICircle, circleB: ICircle): boolean {
    const pair = [circleA, circleB];
    const [centreA, centreB] = pair.map((circle) => circle.getCentre());
    const [radiusA, radiusB] = pair.map((circle) => circle.getDiameter() / 2);

    const distance = centreA.distanceTo(centreB);
    return distance <= (radiusA + radiusB);
  }
}
