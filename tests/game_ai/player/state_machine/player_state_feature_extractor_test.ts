import { Ball } from '../../../../src/game_objects/ball';
import { IBallPossessionService } from '../../../../src/interfaces/iball_possession_service';
import { Player } from '../../../../src/game_objects/player';
import { PlayerStateFeatureExtractor } from '../../../../src/game_ai/player/state_machine/player_state_feature_extractor';
import { Team } from '../../../../src/game_objects/team';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMANDS } from '../../../../src/constants';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let player: Player;
let ball: Ball;

class TestPossessionService implements IBallPossessionService {
  private current: Player;
  private last: Player;

  constructor(current: Player | null, last: Player | null) {
    this.current = current;
    this.last = last;
  }

  public getCurrentPlayerInPossessionOrNull() {
    return this.current;
  }

  public getLastPlayerInPossession() {
    return this.last;
  }
}

describe('PlayerStateMachine', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
    ball = new Ball(0, 0, 0, 0, 5);
  });

  afterEach(() => {
    player = null;
    ball = null;
  });

  describe('`hasBall`', () => {
    it('returns true if the currentplayerinpossession is the player', () => {
      const possessionService = new TestPossessionService(player, null);
      const extractor = new PlayerStateFeatureExtractor(ball, possessionService);
      expect(extractor.hasBall(player)).to.be.true;
    });

    it('returns false if the currentplayerinpossession is not the player', () => {
      const otherPlayer = new Player(0, 0, 0, 0, 5);
      const possessionService = new TestPossessionService(otherPlayer, null);
      const extractor = new PlayerStateFeatureExtractor(ball, possessionService);
      expect(extractor.hasBall(player)).to.be.false;
    });
  });

  describe('`teamInControl`', () => {
    it('returns true if the lastPlayerInPossession is a player teamMate', () => {
      const otherPlayer = new Player(0, 0, 0, 0, 5);
      const team = new Team([]);
      [player, otherPlayer].forEach((element) => element.setTeam(team));
      const possessionService = new TestPossessionService(player, player);
      const extractor = new PlayerStateFeatureExtractor(ball, possessionService);
      expect(extractor.teamInControl(player)).to.be.true;
    });

    it('returns false if the lastPlayerInPossession is not a player teamMate', () => {
      const otherPlayer = new Player(0, 0, 0, 0, 5);
      [player, otherPlayer].forEach((element) => element.setTeam(new Team([])));
      const possessionService = new TestPossessionService(otherPlayer, otherPlayer);
      const extractor = new PlayerStateFeatureExtractor(ball, possessionService);
      expect(extractor.teamInControl(player)).to.be.false;
    });
  });

  describe('`hasGoodPassingOptions`', () => {
    it('returns true', () => {
      const possessionService = new TestPossessionService(null, null);
      const extractor = new PlayerStateFeatureExtractor(ball, possessionService);
      expect(extractor.hasGoodPassingOptions(player)).to.be.true;
    });
  });

  describe('`isInGoodShootingPosition`', () => {
    it('returns true', () => {
      const possessionService = new TestPossessionService(null, null);
      const extractor = new PlayerStateFeatureExtractor(ball, possessionService);
      expect(extractor.isInGoodShootingPosition(player)).to.be.false;
    });
  });

  describe('`isNearestTeamMateToBall`', () => {
    it('returns true if the player is the closest teamMate to the ball', () => {
      const otherPlayer = new Player(5, 5, 0, 0, 5);
      // create team and setTeam in one line
      const team = new Team([player, otherPlayer]);
      const possessionService = new TestPossessionService(null, null);
      const extractor = new PlayerStateFeatureExtractor(ball, possessionService);

      expect(extractor.isNearestTeamMateToBall(player)).to.be.true;
    });

    it('returns false if the player is not the closest teamMate to the ball', () => {
      const team = new Team([]);
      const otherPlayer = new Player(5, 5, 0, 0, 5);
      [player, otherPlayer].forEach((element) => element.setTeam(team));
      const possessionService = new TestPossessionService(null, null);
      const extractor = new PlayerStateFeatureExtractor(ball, possessionService);

      expect(extractor.isNearestTeamMateToBall(otherPlayer)).to.be.false;
    });
  });
});
