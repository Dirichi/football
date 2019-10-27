import { CommandFactory } from "../../../commands/command_factory";
import { DEFAULT_PLAYER_STATE_MACHINE_CONFIG } from "../../../constants";
import { Ball } from "../../../game_objects/ball";
import { Field } from "../../../game_objects/field";
import { IBallPossessionService } from "../../../interfaces/iball_possession_service";
import { IPlayerState } from "../../../interfaces/iplayer_state";
import { IPlayerStateFeatureExtractor } from "../../../interfaces/iplayer_state_feature_extractor";
import { IPlayerStateMachineConfig } from "../../../interfaces/iplayer_state_machine_config";
import { ITickService } from "../../../interfaces/itick_service";
import { AttackingRunState } from "./attacking_run_state";
import { AttackPositionValueCalculator } from "./calculators/attack_position_value_calculator";
import { CongestionCalculator } from "./calculators/congestion_calculator";
import { DefenceValueCalculator } from "./calculators/defence_value_calculator";
import { DribbleValueCalculator } from "./calculators/dribble_value_calculator";
import { InterceptionCalculator } from "./calculators/interception_calculator";
import { PassValueCalculator } from "./calculators/pass_value_calculator";
import { ShotValueCalculator } from "./calculators/shot_value_calculator";
import { TeamInControlCalculator } from "./calculators/team_in_control_calculator";
import { ChasingBallState } from "./chasing_ball_state";
import { DefensiveRunState } from "./defensive_run_state";
import { DribblingState } from "./dribbling_state";
import { FeatureExtractorCacher } from "./feature_extractor_cacher";
import { KeeperState } from "./keeper_state";
import { PassingState } from "./passing_state";
import { PassingToRequesterState } from "./passing_to_requester_state";
import { PlayerStateFeatureExtractor } from "./player_state_feature_extractor";
import { PlayerStateMachine } from "./player_state_machine";
import { ShootingState } from "./shooting_state";
import { WaitingState } from "./waiting_state";

export class PlayerStateMachineModule {
  constructor(
    private ball: Ball,
    private field: Field,
    private ballPossessionService: IBallPossessionService,
    private tickService: ITickService,
    private commandFactory: CommandFactory,
    private config: IPlayerStateMachineConfig = DEFAULT_PLAYER_STATE_MACHINE_CONFIG) { }

  public getStateMachine() {
    const cachedFeatureExtractor = this.getFeatureExtractor();

    const playerStates: IPlayerState[] = [
      new WaitingState(this.commandFactory, cachedFeatureExtractor),
      new KeeperState(this.commandFactory, cachedFeatureExtractor),
      new AttackingRunState(this.commandFactory, cachedFeatureExtractor),
      new DefensiveRunState(this.commandFactory, cachedFeatureExtractor),
      new ChasingBallState(this.commandFactory, cachedFeatureExtractor),
      new ShootingState(
        this.commandFactory,
        cachedFeatureExtractor,
        this.config.shootingStateShotValueThreshold),
      new PassingToRequesterState(this.commandFactory, cachedFeatureExtractor),
      new DribblingState(this.commandFactory, cachedFeatureExtractor),
      new PassingState(this.commandFactory, cachedFeatureExtractor),
    ];

    return new PlayerStateMachine(playerStates);
  }

  public getInterceptionCalculator(): InterceptionCalculator {
    return new InterceptionCalculator();
  }

  public getShotValueCalculator(): ShotValueCalculator {
    return new ShotValueCalculator(this.ball, this.getInterceptionCalculator());
  }

  public getCongestionCalculator(): CongestionCalculator {
    return new CongestionCalculator(this.config.congestionRadiusOfInterest);
  }

  public getAttackingPositionValueCalculator(): AttackPositionValueCalculator {
    return new AttackPositionValueCalculator(
      this.ball,
      this.field,
      this.getCongestionCalculator(),
      this.getShotValueCalculator(),
      this.config.attackIdealDistanceFromGoal,
      this.config.attackCongestionWeight,
      this.config.attackProximityToOpposingPostWeight,
      this.config.attackTrackingBallWeight,
      this.config.attackShotValueWeight
    );
  }

  public getPassValueCalculator(): PassValueCalculator {
    return new PassValueCalculator(
      this.ball,
      this.getInterceptionCalculator(),
      this.getAttackingPositionValueCalculator()
    );
  }

  public getDribbleValueCalculator(): DribbleValueCalculator {
    return new DribbleValueCalculator(
      this.getAttackingPositionValueCalculator(),
      this.getInterceptionCalculator()
    );
  }

  public getDefenceValueCalculator(): DefenceValueCalculator {
    return new DefenceValueCalculator(
      this.ball,
      this.field,
      this.getCongestionCalculator(),
      this.config.defenceMarkingMargin,
      this.config.defenceCongestionWeight,
      this.config.defenceMarkingWeight,
      this.config.defenceAheadOfBallWeight);
  }

  public getTeamInControlCalculator(): TeamInControlCalculator {
    const calculautor = new TeamInControlCalculator(
      this.ballPossessionService, this.config.teamInControlPossessionTimeOut);
    this.tickService.every(0, () => calculautor.update());
    return calculautor;
  }

  public getFeatureExtractor(): IPlayerStateFeatureExtractor {
    const extractor = new PlayerStateFeatureExtractor(
      this.ball,
      this.ballPossessionService,
      this.getPassValueCalculator(),
      this.getShotValueCalculator(),
      this.getAttackingPositionValueCalculator(),
      this.getDribbleValueCalculator(),
      this.getDefenceValueCalculator(),
      this.getTeamInControlCalculator(),
      this.config.featureExtractorPositionDelta);
    const cacher = new FeatureExtractorCacher(extractor,
      this.tickService,
      this.config.featureExtractorRefreshInterval);
    cacher.enableRefreshing();
    return cacher.createCachingProxy();
  }
}
