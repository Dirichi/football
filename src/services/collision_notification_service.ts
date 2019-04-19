import { CollisionDetectionService } from "./collision_detection_service";
import { EventQueue } from "../event_queue";
import { ICollidable } from "../interfaces/icollidable";

export class CollisionNotificationService {
  private collisionGroups: ICollidable[][];
  private queue: EventQueue;
  private detectionService: CollisionDetectionService;

  constructor(detectionService: CollisionDetectionService, queue: EventQueue) {
    this.detectionService = detectionService;
    this.queue = queue;
    this.collisionGroups = [];
  }

  public registerCollisionGroup(group: ICollidable[]): void {
    this.collisionGroups.push(group);
  }

  public getCollisionGroups() {
    // ensure that collisionGroups is not editable
    return [...this.collisionGroups];
  }

  public update(): void {
    const pairs = this.getAllPairs();
    const collidingPairs = pairs.filter((pair) => this.isColliding(pair));
    collidingPairs.forEach((pair) => this.notifyCollision(pair));
  }

  private isColliding(pair: [ICollidable, ICollidable]): boolean {
    return this.detectionService.isColliding(pair[0], pair[1]);
  }

  private notifyCollision(collisionPair: [ICollidable, ICollidable]): void {
    const [collidableA, collidableB] = collisionPair;
    this.queue.trigger(`${collidableA.getGameObjectId()}.collision`, {
      collidingObject: collidableB,
    });

    this.queue.trigger(`${collidableB.getGameObjectId()}.collision`, {
      collidingObject: collidableA,
    });
  }

  private getAllPairs(): Array<[ICollidable, ICollidable]> {
    return this.collisionGroups.flatMap((group) => this.getAllPairsInGroup(group));
  }

  private getAllPairsInGroup(group: ICollidable[]): Array<[ICollidable, ICollidable]> {
    const pairs: Array<[ICollidable, ICollidable]> = [];
    group.forEach((collidable, index) => {
      group.forEach((otherCollidable, otherIndex) => {
        if (index < otherIndex) {
          pairs.push([collidable, otherCollidable]);
        }
      });
    });

    return pairs;
  }
}
