import { Player } from "../../src/game_objects/player";
import { IPlayerStateFeatureExtractor } from "../../src/interfaces/iplayer_state_feature_extractor";
import { Vector3D } from "../../src/three_dimensional_vector";

export class TestPlayerStateFeatureExtractor
  implements IPlayerStateFeatureExtractor {

    public bestDefencePositionOption(player: Player): Vector3D {
      return new Vector3D(0, 0, 0);
    }

    public bestDribbleOption(player: Player): Vector3D {
      return new Vector3D(0, 0, 0);
    }

    public bestDribbleValue(player: Player): number {
      return 0
    }

    public bestPassingOption(player: Player): Player {
      return new Player(0, 0, 0, 0, 0);
    }

    public bestPassValue(player: Player): number {
      return 0;
    }

    public bestPositionOption(player: Player): Vector3D {
      return new Vector3D(0, 0, 0);
    }

    public bestShotValue(player: Player): number {
      return 0;
    }

    public bestShotTargetOption(player: Player): Vector3D {
      return new Vector3D(0, 0, 0);
    }

    public hasBall(player: Player): boolean {
      return false;
    }

    public receivedWaitMessage(player: Player): boolean {
      return false;
    }

    public teamInControl(player: Player): boolean {
      return false;
    }

    public expectedPassInterceptedOrCompleted(player: Player): boolean {
      return false;
    }

    public isEligibleToMark(player: Player): boolean {
      return false;
    }

    public isNearestToBall(player: Player): boolean {
      return false;
    }

    public receivedPassRequest(player: Player): boolean {
      return false;
    }

    public getBestPositionedPassRequestSender(player: Player): Player {
      return player;
    }
}
