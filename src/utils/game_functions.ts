import { NUM_SHOT_TARGETS } from "../constants";
import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { Post } from "../game_objects/post";
import { Vector3D } from "../three_dimensional_vector";
import { range } from "./helper_functions";

export function distanceAheadOfBall(
  position: Vector3D, ball: Ball, referencePost: Post): number {
  const postPosition = referencePost.getMidPoint();
  const distanceToPost = Math.abs(position.x - postPosition.x);
  const ballDistanceToPost = Math.abs(ball.getPosition().x - postPosition.x);

  return ballDistanceToPost - distanceToPost;
}

export function shotTargetOptions(player: Player): Vector3D[] {
  const post = player.getOpposingGoalPost();
  const targetDelta = post.ylength / (NUM_SHOT_TARGETS - 1);

  return range(NUM_SHOT_TARGETS).map((index) => {
    const yPosition = post.y + (index * targetDelta);
    return new Vector3D(post.x, yPosition, 0);
  });
}
