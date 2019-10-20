import { EventQueue } from "../event_queue";
import { Ball } from "../game_objects/ball";
import { Post } from "../game_objects/post";
import { IGoalDetectionService } from "../interfaces/igoal_detection_service";

export class GoalDetectionService implements IGoalDetectionService {
  private goalScored: boolean = false;
  private postContainingBall: Post | null = null;

  constructor(
    private ball: Ball,
    private posts: Post[],
    private queue: EventQueue) {
  }

  public update(): void {
    const postContainingBall = this.findPostContainingBall();
    this.goalScored = (postContainingBall !== null) && !this.postContainingBall;
    if (this.goalScored) {
      this.queue.trigger(this.eventTag(), postContainingBall);
    }
    this.postContainingBall = postContainingBall;
  }

  public whenGoalDetected(callback: (post: Post) => void): void {
    this.queue.when(this.eventTag(), callback);
  }

  public goalDetected(): boolean {
    return this.goalScored;
  }

  public getPostContainingBall(): Post | null {
    return this.postContainingBall;
  }

  private findPostContainingBall(): Post | null {
    return this.posts.find((post) => post.containsBall(this.ball)) || null;
  }

  private eventTag(): string {
    return `${this.constructor.name}.goalDetected`;
  }
}
