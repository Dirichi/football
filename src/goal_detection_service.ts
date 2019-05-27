import { Ball } from "./game_objects/ball";
import { Post } from "./game_objects/post";

export class GoalDetectionService {
  private ball: Ball;
  private posts: Post[];
  private goalScored: boolean;
  private postContainingBall: Post | null;

  constructor(ball: Ball, posts: Post[]) {
    this.ball = ball;
    this.posts = posts;
    this.postContainingBall = null;
    this.goalScored = false;
  }

  public update(): void {
    const postContainingBall = this.findPostContainingBall();
    this.goalScored = postContainingBall && !this.postContainingBall;
    this.postContainingBall = postContainingBall;
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
}
