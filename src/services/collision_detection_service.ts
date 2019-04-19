import { EventQueue } from "../event_queue";
import { ICollidable } from "../interfaces/icollidable";

export class CollisionDetectionService {
  public isColliding(collidableA: ICollidable, collidableB: ICollidable): boolean {
    return true;
  }
}
