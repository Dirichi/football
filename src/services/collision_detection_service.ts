import { EventQueue } from "../event_queue";
import { ICircle } from "../interfaces/icircle";
import { ICollidable } from "../interfaces/icollidable";

export class CollisionDetectionService {
  private collisionMarginFactor: number;

  constructor(collisionMarginFactor: number = 1) {
    this.collisionMarginFactor = collisionMarginFactor;
  }

  public isColliding(
    collidableA: ICollidable, collidableB: ICollidable): boolean {
      const shapeA = collidableA.getShape();
      const shapeB = collidableB.getShape();

      if (shapeA.kind === "circle" && shapeB.kind === "circle") {
        return this.cicleCircleColliding(shapeA, shapeB);
      }

      throw new Error(`Unexpected shape kinds ${shapeA.kind}, ${shapeB.kind}`);
  }

  public setCollisionMarginFactor(factor: number) {
    this.collisionMarginFactor = factor;
  }

  private cicleCircleColliding(circleA: ICircle, circleB: ICircle): boolean {
    const pair = [circleA, circleB];
    const [centreA, centreB] = pair.map((circle) => circle.getCentre());
    const [radiusA, radiusB] = pair.map((circle) => circle.getDiameter() / 2);

    const distance = centreA.distanceTo(centreB);
    // This is an imperfect solution. Ideally, each shape or "bounding box"
    // should be able to define it's margin for collision.
    // This is here because it's the easiest thing to do right now, and the
    // player needs it to be able to control the ball with ease
    return distance <= (radiusA + radiusB) * this.collisionMarginFactor;
  }
}
