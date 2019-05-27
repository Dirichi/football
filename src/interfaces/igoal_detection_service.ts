import { Post } from "../game_objects/post";

export interface IGoalDetectionService {
  goalDetected(): boolean;
  getPostContainingBall(): Post | null;
}
