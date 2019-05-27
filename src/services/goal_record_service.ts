import { Ball } from "../game_objects/ball";
import { Team } from "../game_objects/team";
import { IGoalDetectionService } from "../interfaces/igoal_detection_service";

export class GoalRecordService {
  private detectionService: IGoalDetectionService;
  private teams: Team[];
  private scoresByTeam: Map<Team, number>;
  private lastScoringTeam?: Team;

  constructor(detectionService: IGoalDetectionService, teams: Team[]) {
    this.detectionService = detectionService;
    this.teams = teams;
    this.scoresByTeam = new Map([[teams[0], 0], [teams[1], 0]]);
    this.lastScoringTeam = null;
  }

  public update(): void {
    if (!this.detectionService.goalDetected()) { return; }

    const postWithBall = this.detectionService.getPostContainingBall();
    this.lastScoringTeam = this.teams.find((team) => {
      return team.getOpposingGoalPost() === postWithBall;
    });
    this.incrementScoreFor(this.lastScoringTeam);
  }

  public getLastScoringTeam(): Team | null {
    return this.lastScoringTeam;
  }

  public getLastConcedingTeam(): Team | null {
    if (!this.lastScoringTeam) { return null; }
    return this.lastScoringTeam.getOpposition();
  }

  public goalsFor(team: Team): number | null {
    if (!this.teams.includes(team)) { return null; }
    return this.scoresByTeam.get(team);
  }

  private incrementScoreFor(team: Team): void {
    const newScore = this.scoresByTeam.get(team) + 1;
    this.scoresByTeam.set(team, newScore);
  }
}
