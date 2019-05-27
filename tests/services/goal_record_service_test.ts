import { Post } from '../../src/game_objects/post';
import { Team } from '../../src/game_objects/team';
import { IGoalDetectionService } from '../../src/interfaces/igoal_detection_service';
import { GoalRecordService } from '../../src/services/goal_record_service';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

class TestGoalDetectionService implements IGoalDetectionService {
  private goalDetectedStub: boolean;
  private postContainingBallStub: Post;

  constructor() {
    this.goalDetectedStub = false;
    this.postContainingBallStub = null;
  }

  public setGoalDetected(flag: boolean) {
    this.goalDetectedStub = flag;
  }

  public setPostContainingBall(post: Post) {
    this.postContainingBallStub = post;
  }

  public goalDetected(): boolean {
    return this.goalDetectedStub;
  }

  public getPostContainingBall(): Post {
    return this.postContainingBallStub;
  }
}

describe('GoalRecordService', () => {
  describe('`update`', () => {
    it('increments scores for scoring teams', () => {
      const [teamA, teamB] = [new Team([]), new Team([])];
      const [postA, postB] = [new Post(0, 0, 0, 0), new Post(0, 0, 0, 0)];
      teamA.setOpposingGoalPost(postB);
      teamB.setOpposingGoalPost(postA);

      const detectionService = new TestGoalDetectionService();
      detectionService.setGoalDetected(true);
      detectionService.setPostContainingBall(postA);

      const recordService =
        new GoalRecordService(detectionService, [teamA, teamB]);
      recordService.update();

      expect(recordService.goalsFor(teamB)).to.eq(1);
      expect(recordService.goalsFor(teamA)).to.eq(0);
    });

    it('does not increment scores if no team scores', () => {
      const [teamA, teamB] = [new Team([]), new Team([])];
      const [postA, postB] = [new Post(0, 0, 0, 0), new Post(0, 0, 0, 0)];
      teamA.setOpposingGoalPost(postB);
      teamB.setOpposingGoalPost(postA);

      const detectionService = new TestGoalDetectionService();
      detectionService.setGoalDetected(false);

      const recordService =
        new GoalRecordService(detectionService, [teamA, teamB]);

      recordService.update();

      expect(recordService.goalsFor(teamA)).to.eq(0);
      expect(recordService.goalsFor(teamB)).to.eq(0);
    });
  });

  describe('getLastScoringTeam', () => {
    it('returns the most recent scoring team', () => {
      const [teamA, teamB] = [new Team([]), new Team([])];
      const [postA, postB] = [new Post(0, 0, 0, 0), new Post(0, 0, 0, 0)];
      teamA.setOpposingGoalPost(postB);
      teamB.setOpposingGoalPost(postA);

      const detectionService = new TestGoalDetectionService();
      detectionService.setGoalDetected(true);
      detectionService.setPostContainingBall(postA);

      const recordService =
        new GoalRecordService(detectionService, [teamA, teamB]);

      recordService.update();

      expect(recordService.getLastScoringTeam()).to.eql(teamB);
    });

    it('returns null if there has been no goal scored', () => {
      const [teamA, teamB] = [new Team([]), new Team([])];
      const [postA, postB] = [new Post(0, 0, 0, 0), new Post(0, 0, 0, 0)];
      teamA.setOpposingGoalPost(postB);
      teamB.setOpposingGoalPost(postA);

      const detectionService = new TestGoalDetectionService();
      detectionService.setGoalDetected(false);

      const recordService =
        new GoalRecordService(detectionService, [teamA, teamB]);

      recordService.update();

      expect(recordService.getLastScoringTeam()).to.be.null;
    });
  });
});
