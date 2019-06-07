import { Ball } from '../../../../src/game_objects/ball';
import { IPassValueCalculator } from '../../../../src/interfaces/ipass_value_calculator';
import { IShotValueCalculator } from '../../../../src/interfaces/ishot_value_calculator';
import { Player } from '../../../../src/game_objects/player';
import { PlayerStateFeatureExtractor } from '../../../../src/game_ai/player/state_machine/player_state_feature_extractor';
import { Team } from '../../../../src/game_objects/team';
import { TestBallPossessionService } from '../../../helpers/test_ball_possession_service';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMAND_ID } from '../../../../src/constants';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let player: Player;
let ball: Ball;
let passValueCalculator: IPassValueCalculator;
let shotValueCalculator: IShotValueCalculator;

describe('PlayerStateFeatureExtractor', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
    ball = new Ball(0, 0, 0, 0, 5);
    passValueCalculator = {
      valueFor: (player: Player) => 0.5,
    }
    shotValueCalculator = {
      valueFor: (player: Player) => 0.5,
    }
  });

  afterEach(() => {
    player = null;
    ball = null;
    passValueCalculator = null;
    shotValueCalculator = null;
  });

  describe('`hasBall`', () => {
    it('returns true if the player hasBall', () => {
      sinon.stub(player, 'hasBall').returns(true);
      const possessionService = new TestBallPossessionService();
      const extractor =
        new PlayerStateFeatureExtractor(
          ball, possessionService, passValueCalculator, shotValueCalculator);
      expect(extractor.hasBall(player)).to.be.true;
    });

    it('returns false if the currentplayerinpossession is not the player',
        () => {
        const otherPlayer = new Player(0, 0, 0, 0, 5);
        const possessionService = new TestBallPossessionService(otherPlayer, null);
        const extractor =
          new PlayerStateFeatureExtractor(
            ball, possessionService, passValueCalculator, shotValueCalculator);
        expect(extractor.hasBall(player)).to.be.false;
    });
  });

  describe('`teamInControl`', () => {
    it('returns true if the lastPlayerInPossession is a player teamMate',
      () => {
        const otherPlayer = new Player(0, 0, 0, 0, 5);
        const team = new Team([]);
        [player, otherPlayer].forEach((element) => element.setTeam(team));
        const possessionService = new TestBallPossessionService(player, player);
        const extractor =
          new PlayerStateFeatureExtractor
          (ball, possessionService, passValueCalculator, shotValueCalculator);
        expect(extractor.teamInControl(player)).to.be.true;
    });

    it('returns false if the lastPlayerInPossession is not a player teamMate',
      () => {
        const otherPlayer = new Player(0, 0, 0, 0, 5);
        [player, otherPlayer].forEach((element) => {
          element.setTeam(new Team([]))
        });
        const possessionService = new TestBallPossessionService(
          otherPlayer, otherPlayer);
        const extractor =
          new PlayerStateFeatureExtractor(
            ball, possessionService, passValueCalculator, shotValueCalculator);
        expect(extractor.teamInControl(player)).to.be.false;
    });
  });

  describe('`hasOpenPassingOptions`', () => {
    it('returns true if the passValue is greater than 0 for some of the' +
        ' player\'s teamMates', () => {
          const mateOne = new Player(0, 0, 0, 0, 5);
          const mateTwo = new Player(0, 0, 0, 0, 5);
          const team = new Team([mateOne, mateTwo, player]);

          const passValueStub = sinon.stub(passValueCalculator, 'valueFor');
          passValueStub.withArgs(mateOne).returns(0);
          passValueStub.withArgs(mateTwo).returns(0.5);

          const possessionService = new TestBallPossessionService();
          const extractor =
            new PlayerStateFeatureExtractor(
              ball, possessionService, passValueCalculator,
              shotValueCalculator);
          expect(extractor.hasOpenPassingOptions(player)).to.be.true;
    });

    it('returns false if the passValue is 0 for all the player\'s' +
        ' teamMates', () => {
          const mateOne = new Player(0, 0, 0, 0, 5);
          const mateTwo = new Player(0, 0, 0, 0, 5);
          const team = new Team([mateOne, mateTwo, player]);

          const passValueStub = sinon.stub(passValueCalculator, 'valueFor');
          passValueStub.withArgs(mateOne).returns(0);
          passValueStub.withArgs(mateTwo).returns(0);

          const possessionService = new TestBallPossessionService();
          const extractor =
            new PlayerStateFeatureExtractor(
              ball, possessionService, passValueCalculator,
              shotValueCalculator);
          expect(extractor.hasOpenPassingOptions(player)).to.be.false;
    });
  });

  describe('`bestPassingOption`', () => {
    it('returns true player with the best passing value', () => {
      const mateOne = new Player(0, 0, 0, 0, 5);
      const mateTwo = new Player(0, 0, 0, 0, 5);
      const team = new Team([mateOne, mateTwo, player]);

      const passValueStub = sinon.stub(passValueCalculator, 'valueFor');
      passValueStub.withArgs(mateOne).returns(0);
      passValueStub.withArgs(mateTwo).returns(0.5);

      const possessionService = new TestBallPossessionService();
      const extractor =
        new PlayerStateFeatureExtractor(
          ball, possessionService, passValueCalculator,
          shotValueCalculator);
      expect(extractor.bestPassingOption(player)).to.equal(mateTwo);
    });
  });

  describe('`isNearestTeamMateToBall`', () => {
    it('returns true if the player is the closest teamMate to the ball', () => {
      const otherPlayer = new Player(5, 5, 0, 0, 5);
      // create team and setTeam in one line
      const team = new Team([player, otherPlayer]);
      const possessionService = new TestBallPossessionService();
      const extractor =
        new PlayerStateFeatureExtractor(
          ball, possessionService, passValueCalculator, shotValueCalculator);

      expect(extractor.isNearestTeamMateToBall(player)).to.be.true;
    });

    it('returns false if the player is not the closest teamMate to the ball',
        () => {
        const otherPlayer = new Player(5, 5, 0, 0, 5);
        // create team and setTeam in one line
        const team = new Team([player, otherPlayer]);
        const possessionService = new TestBallPossessionService();
        const extractor =
          new PlayerStateFeatureExtractor(
            ball, possessionService, passValueCalculator, shotValueCalculator);

        expect(extractor.isNearestTeamMateToBall(otherPlayer)).to.be.false;
    });
  });
});
