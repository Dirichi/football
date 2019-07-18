import { Ball } from '../../../../src/game_objects/ball';
import { IPassValueCalculator } from '../../../../src/interfaces/ipass_value_calculator';
import { IAttackingPositionValueCalculator } from '../../../../src/interfaces/iattacking_position_value_calculator';
import { IPlayerMessage } from '../../../../src/interfaces/iplayer_message';
import { IShotValueCalculator } from '../../../../src/interfaces/ishot_value_calculator';
import { IDribbleValueCalculator } from '../../../../src/interfaces/idribble_value_calculator';
import { Player } from '../../../../src/game_objects/player';
import { PlayerStateFeatureExtractor } from '../../../../src/game_ai/player/state_machine/player_state_feature_extractor';
import { Team } from '../../../../src/game_objects/team';
import { TestBallPossessionService } from '../../../helpers/test_ball_possession_service';
import { Vector3D } from '../../../../src/three_dimensional_vector';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMAND_ID, STATE_MACHINE_COMMANDS } from '../../../../src/constants';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let player: Player;
let ball: Ball;
let passValueCalculator: IPassValueCalculator;
let shotValueCalculator: IShotValueCalculator;
let positionValueCalculator: IAttackingPositionValueCalculator;
let dribbleValueCalculator: IDribbleValueCalculator;

describe('PlayerStateFeatureExtractor', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
    ball = new Ball(0, 0, 0, 0, 5);
    passValueCalculator = {
      evaluate: (player: Player) => 0.5,
    }
    shotValueCalculator = {
      evaluate: (player: Player, shootingFrom?: Vector3D) => 0.5,
    }
    positionValueCalculator = {
      evaluate: (player: Player, position?: Vector3D) => 0.5,
    }

    dribbleValueCalculator = {
      evaluate: (
        player: Player, endPositon: Vector3D, startPosition: Vector3D) => 0.5,
    }
  });

  afterEach(() => {
    player = null;
    ball = null;
    passValueCalculator = null;
    shotValueCalculator = null;
    positionValueCalculator = null;
    dribbleValueCalculator = null;
  });

  describe('`hasBall`', () => {
    it('returns true if the player hasBall', () => {
      sinon.stub(player, 'hasBall').returns(true);
      const possessionService = new TestBallPossessionService();
      const extractor = new PlayerStateFeatureExtractor(
        ball,
        possessionService,
        passValueCalculator,
        shotValueCalculator,
        positionValueCalculator,
        dribbleValueCalculator
      );
      expect(extractor.hasBall(player)).to.be.true;
    });

    it('returns false if the player does not have the ball', () => {
      sinon.stub(player, 'hasBall').returns(false);
      const possessionService = new TestBallPossessionService();
      const extractor = new PlayerStateFeatureExtractor(
        ball,
        possessionService,
        passValueCalculator,
        shotValueCalculator,
        positionValueCalculator,
        dribbleValueCalculator
      );
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
        const extractor = new PlayerStateFeatureExtractor(
          ball,
          possessionService,
          passValueCalculator,
          shotValueCalculator,
          positionValueCalculator,
          dribbleValueCalculator
        );
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
        const extractor = new PlayerStateFeatureExtractor(
          ball,
          possessionService,
          passValueCalculator,
          shotValueCalculator,
          positionValueCalculator,
          dribbleValueCalculator
        );
        expect(extractor.teamInControl(player)).to.be.false;
    });
  });

  describe('`bestPassingOption`', () => {
    it('returns true player with the best passing value', () => {
      const mateOne = new Player(0, 0, 0, 0, 5);
      const mateTwo = new Player(0, 0, 0, 0, 5);
      const team = new Team([mateOne, mateTwo, player]);

      const passValueStub = sinon.stub(passValueCalculator, 'evaluate');
      passValueStub.withArgs(mateOne).returns(0);
      passValueStub.withArgs(mateTwo).returns(0.5);

      const possessionService = new TestBallPossessionService();
      const extractor = new PlayerStateFeatureExtractor(
        ball,
        possessionService,
        passValueCalculator,
        shotValueCalculator,
        positionValueCalculator,
        dribbleValueCalculator
      );
      expect(extractor.bestPassingOption(player)).to.equal(mateTwo);
    });
  });

  describe('`isNearestTeamMateToBall`', () => {
    it('returns true if the player is the closest teamMate to the ball', () => {
      const otherPlayer = new Player(5, 5, 0, 0, 5);
      // create team and setTeam in one line
      const team = new Team([player, otherPlayer]);
      const possessionService = new TestBallPossessionService();
      const extractor = new PlayerStateFeatureExtractor(
        ball,
        possessionService,
        passValueCalculator,
        shotValueCalculator,
        positionValueCalculator,
        dribbleValueCalculator
      );

      expect(extractor.isNearestTeamMateToBall(player)).to.be.true;
    });

    it('returns false if the player is not the closest teamMate to the ball',
        () => {
        const otherPlayer = new Player(5, 5, 0, 0, 5);
        // create team and setTeam in one line
        const team = new Team([player, otherPlayer]);
        const possessionService = new TestBallPossessionService();
        const extractor = new PlayerStateFeatureExtractor(
          ball,
          possessionService,
          passValueCalculator,
          shotValueCalculator,
          positionValueCalculator,
          dribbleValueCalculator
        );

        expect(extractor.isNearestTeamMateToBall(otherPlayer)).to.be.false;
    });
  });

  describe('`receivedWaitMessage`', () => {
    it('returns true if the player has WAIT messages', () => {
      const message = {
        title: STATE_MACHINE_COMMANDS.WAIT,
        sender: new Player(0, 0, 0, 0, 0),
      } as IPlayerMessage;
      sinon.stub(player, 'getMessages').returns([message]);
      const possessionService = new TestBallPossessionService();
      const extractor = new PlayerStateFeatureExtractor(
        ball,
        possessionService,
        passValueCalculator,
        shotValueCalculator,
        positionValueCalculator,
        dribbleValueCalculator
      );

      expect(extractor.receivedWaitMessage(player)).to.be.true;
    });

    it('returns false if the player does not have WAIT messages', () => {
      sinon.stub(player, 'getMessages').returns([]);
      const possessionService = new TestBallPossessionService();
      const extractor = new PlayerStateFeatureExtractor(
        ball,
        possessionService,
        passValueCalculator,
        shotValueCalculator,
        positionValueCalculator,
        dribbleValueCalculator
      );

      expect(extractor.receivedWaitMessage(player)).to.be.false;
    });
  });

  describe('`expectedPassInterceptedOrCompleted`', () => {
    context('when the player has wait messages', () => {
      it('returns true if the player is in possesion (pass completed)', () => {
        const sender = new Player(0, 0, 0, 0, 0);
        const message = {
          title: STATE_MACHINE_COMMANDS.WAIT,
          sender: sender,
        } as IPlayerMessage;
        sinon.stub(player, 'getMessages').returns([message]);
        const possessionService = new TestBallPossessionService();
        sinon.stub(possessionService, 'getCurrentPlayerInPossessionOrNull')
          .returns(player);
        const extractor = new PlayerStateFeatureExtractor(
          ball,
          possessionService,
          passValueCalculator,
          shotValueCalculator,
          positionValueCalculator,
          dribbleValueCalculator
        );

        expect(extractor.expectedPassInterceptedOrCompleted(player)).to.be.true;
      });

      it('returns true if another player is in possesion (pass intercepted)', () => {
        const sender = new Player(0, 0, 0, 0, 0);
        const interceptor = new Player(0, 0, 0, 0, 0);
        const message = {
          title: STATE_MACHINE_COMMANDS.WAIT,
          sender: sender,
        } as IPlayerMessage;
        sinon.stub(player, 'getMessages').returns([message]);
        const possessionService = new TestBallPossessionService();
        sinon.stub(possessionService, 'getCurrentPlayerInPossessionOrNull')
          .returns(interceptor);
        const extractor = new PlayerStateFeatureExtractor(
          ball,
          possessionService,
          passValueCalculator,
          shotValueCalculator,
          positionValueCalculator,
          dribbleValueCalculator
        );

        expect(extractor.expectedPassInterceptedOrCompleted(player)).to.be.true;
      });

      it('returns false if the sender is with the ball', () => {
        const sender = new Player(0, 0, 0, 0, 0);
        const message = {
          title: STATE_MACHINE_COMMANDS.WAIT,
          sender: sender,
        } as IPlayerMessage;
        sinon.stub(player, 'getMessages').returns([message]);
        const possessionService = new TestBallPossessionService();
        sinon.stub(possessionService, 'getCurrentPlayerInPossessionOrNull')
          .returns(sender);
        const extractor = new PlayerStateFeatureExtractor(
          ball,
          possessionService,
          passValueCalculator,
          shotValueCalculator,
          positionValueCalculator,
          dribbleValueCalculator
        );

        expect(
          extractor.expectedPassInterceptedOrCompleted(player)).to.be.false;
      });

      it('returns false if no player is currently in possession', () => {
        const sender = new Player(0, 0, 0, 0, 0);
        const message = {
          title: STATE_MACHINE_COMMANDS.WAIT,
          sender: sender,
        } as IPlayerMessage;
        sinon.stub(player, 'getMessages').returns([message]);
        const possessionService = new TestBallPossessionService();
        sinon.stub(possessionService, 'getCurrentPlayerInPossessionOrNull')
          .returns(null);
        const extractor = new PlayerStateFeatureExtractor(
          ball,
          possessionService,
          passValueCalculator,
          shotValueCalculator,
          positionValueCalculator,
          dribbleValueCalculator
        );

        expect(
          extractor.expectedPassInterceptedOrCompleted(player)).to.be.false;
      });
    });

    context('when the player has no wait messages', () => {
      it('returns false', () => {
        sinon.stub(player, 'getMessages').returns([]);
        const possessionService = new TestBallPossessionService();
        const extractor = new PlayerStateFeatureExtractor(
          ball,
          possessionService,
          passValueCalculator,
          shotValueCalculator,
          positionValueCalculator,
          dribbleValueCalculator
        );

        expect(
          extractor.expectedPassInterceptedOrCompleted(player)).to.be.false;
        });
    });
  });
});
