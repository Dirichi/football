import {
  PLAYER_MESSAGES,
  POSITION_DELTA_FOR_POSITION_VALUE_CALCULATION
} from "../../../constants";
import { Ball } from "../../../game_objects/ball";
import { Player } from "../../../game_objects/player";
import { Post } from "../../../game_objects/post";
import { IAttackPositionValueCalculator } from "../../../interfaces/iattack_position_value_calculator";
import { IBallPossessionService } from "../../../interfaces/iball_possession_service";
import { IDefenceValueCalculator } from "../../../interfaces/idefence_value_calculator";
import { IDribbleValueCalculator } from "../../../interfaces/idribble_value_calculator";
import { IPassValueCalculator } from "../../../interfaces/ipass_value_calculator";
import { IPlayerStateFeatureExtractor } from "../../../interfaces/iplayer_state_feature_extractor";
import { IShotValueCalculator } from "../../../interfaces/ishot_value_calculator";
import { Vector3D } from "../../../three_dimensional_vector";
import { distanceAheadOfBall, shotTargetOptions } from "../../../utils/game_functions";
import { maximumBy, minimumBy } from "../../../utils/helper_functions";

export class PlayerStateFeatureExtractor implements IPlayerStateFeatureExtractor {
  constructor(
    private ball: Ball,
    private ballPossessionService: IBallPossessionService,
    private passValueCalculator: IPassValueCalculator,
    private shotValueCalculator: IShotValueCalculator,
    private positionValueCalculator: IAttackPositionValueCalculator,
    private dribbleValueCalculator: IDribbleValueCalculator,
    private defenceValueCalculator: IDefenceValueCalculator) {
  }

  public teamInControl(player: Player): boolean {
    const lastPlayerInPossession =
      this.ballPossessionService.getLastPlayerInPossession();

    if (!lastPlayerInPossession) {
      // TODO: Test this behavior
      return false;
    }
    return lastPlayerInPossession.getTeam() === player.getTeam();
  }

  public hasBall(player: Player): boolean {
    return player.hasBall();
  }

  public bestPassingOption(player: Player): Player {
    return maximumBy(player.teamMates(), (teamMate: Player) => {
      return this.passValueCalculator.evaluate(teamMate);
    });
  }

  public bestDribbleOption(player: Player): Vector3D {
    const positions = this.positionOptions(player);
    return maximumBy(positions, (position) => {
      return this.dribbleValueCalculator.evaluate(player, position);
    });
  }

  public bestPassValue(player: Player): number {
    const bestPassOption = this.bestPassingOption(player);
    return this.passValueCalculator.evaluate(bestPassOption);
  }

  public bestDribbleValue(player: Player): number {
    const bestDribbleOption = this.bestDribbleOption(player);
    return this.dribbleValueCalculator.evaluate(player, bestDribbleOption);
  }

  public bestShotValue(player: Player): number {
    const bestShotTargetOption = this.bestShotTargetOption(player);
    return this.shotValueCalculator.evaluate(player, bestShotTargetOption);
  }

  public bestShotTargetOption(player: Player): Vector3D {
    const shotTargets = shotTargetOptions(player);
    return maximumBy(shotTargets, (shotTarget) => {
      return this.shotValueCalculator.evaluate(player, shotTarget);
    });
  }

  public bestPositionOption(player: Player): Vector3D {
    const positions = this.positionOptions(player);
    return maximumBy(positions, (position) => {
      return this.positionValueCalculator.evaluate(player, position, position);
    });
  }

  public isEligibleToMark(player: Player): boolean {
    const post = player.getGoalPost();
    const players = this.teamPlayersAheadOfBall(player, post);
    if (!players.length) {
      return this.isNearestTeamMateToBall(player);
    }

    const eligibleMarker = minimumBy(players, (eachPlayer) => {
      return eachPlayer.getPosition().distanceTo(this.ball.getPosition());
    });

    return player === eligibleMarker;
  }

  public bestDefencePositionOption(player: Player): Vector3D {
    const positions = this.positionOptions(player);
    return maximumBy(positions, (position) => {
      return this.defenceValueCalculator.evaluate(player, position);
    });
  }

  public receivedWaitMessage(player: Player): boolean {
    return player.getMessages()
      .map((message) => message.title)
      .includes(PLAYER_MESSAGES.WAIT);
  }

  public expectedPassInterceptedOrCompleted(player: Player): boolean {
    const waitMessage = player.getMessages().find(
      (message) => message.title === PLAYER_MESSAGES.WAIT);

    if (!waitMessage) { return false; }
    const currentPlayerInPossession =
      this.ballPossessionService.getCurrentPlayerInPossessionOrNull();

    return ![null, waitMessage.sender].includes(currentPlayerInPossession);
  }

  public isNearestToBall(player: Player): boolean {
    const ballPosition = this.ball.getPosition();
    const players =
      [...player.getTeam().getPlayers(), ...player.getOpposingPlayers()];

    const closestPlayer = minimumBy(players, (eachPlayer: Player) => {
      return eachPlayer.getPosition().distanceTo(ballPosition);
    });

    return closestPlayer === player;
  }

  public receivedPassRequest(player: Player): boolean {
    return player
      .getMessages()
      .some((message) => message.title === PLAYER_MESSAGES.PASS);
  }

  public getBestPositionedPassRequestSender(player: Player): Player {
    const requesters = player
      .getMessages()
      .filter((message) => message.title === PLAYER_MESSAGES.PASS)
      .map((message) => message.sender);
    return maximumBy(requesters, (requester) => {
      return this.positionValueCalculator.evaluate(requester);
    });
  }

  private isNearestTeamMateToBall(player: Player): boolean {
    const ballPosition = this.ball.getPosition();
    const players = player.getTeam().getPlayers();

    const closestTeamMate = minimumBy(players, (teamMate: Player) => {
      return teamMate.getPosition().distanceTo(ballPosition);
    });

    return closestTeamMate === player;
  }

  private teamPlayersAheadOfBall(
    player: Player, referencePost: Post): Player[] {
    return player.getTeam().getPlayers().filter((eachPlayer) => {
      const position = eachPlayer.getPosition();
      return distanceAheadOfBall(position, this.ball, referencePost) >= 0;
    });
  }

  private positionOptions(player: Player): Vector3D[] {
    const delta = POSITION_DELTA_FOR_POSITION_VALUE_CALCULATION;
    const positionDiffs = [
      new Vector3D(delta, 0, 0),
      new Vector3D(-delta, 0, 0),
      new Vector3D(0, delta, 0),
      new Vector3D(0, -delta, 0),
      new Vector3D(0, 0, 0),
    ];

    return positionDiffs.map((position) => {
      return player.getPosition().add(position);
    });
  }
}
