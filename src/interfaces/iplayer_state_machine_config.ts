export interface IPlayerStateMachineConfig {
  attackCongestionWeight: number;
  attackProximityToOpposingPostWeight: number;
  attackTrackingBallWeight: number;
  attackShotValueWeight: number;
  defenceCongestionWeight: number;
  defenceMarkingWeight: number;
  defenceAheadOfBallWeight: number;
  attackIdealDistanceFromGoal: number;
  defenceMarkingMargin: number;
  congestionRadiusOfInterest: number;
  shootingStateShotValueThreshold: number;
  teamInControlPossessionTimeOut: number;
  featureExtractorRefreshInterval: number;
  featureExtractorPositionDelta: number;
}
