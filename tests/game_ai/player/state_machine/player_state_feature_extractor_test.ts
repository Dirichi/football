import { Ball } from '../../../../src/game_objects/ball';
import { IPassValueCalculator } from '../../../../src/interfaces/ipass_value_calculator';
import { IAttackPositionValueCalculator } from '../../../../src/interfaces/iattack_position_value_calculator';
import { IPlayerMessage } from '../../../../src/interfaces/iplayer_message';
import { IShotValueCalculator } from '../../../../src/interfaces/ishot_value_calculator';
import { IDribbleValueCalculator } from '../../../../src/interfaces/idribble_value_calculator';
import { IDefenceValueCalculator } from '../../../../src/interfaces/idefence_value_calculator';
import { Player } from '../../../../src/game_objects/player';
import { PlayerStateFeatureExtractor } from '../../../../src/game_ai/player/state_machine/player_state_feature_extractor';
import { Team } from '../../../../src/game_objects/team';
import { TestBallPossessionService } from '../../../helpers/test_ball_possession_service';
import { Vector3D } from '../../../../src/three_dimensional_vector';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { ITeamInControlCalculator } from '../../../../src/interfaces/iteam_in_control_calculator';
import { PLAYER_MESSAGES } from '../../../../src/constants';

import sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

class TestPassValueCalculator
  implements IPassValueCalculator {
  private playerToPassValueMapping: Map<Player, number> = new Map([]);
  private defaultValue: number;

  setValue(player: Player, score: number): void {
    this.playerToPassValueMapping.set(player, score);
  }

  setDefaultValue(value: number): this {
    this.defaultValue = value;
    return this;
  }

  evaluate(player: Player): number {
    const value = this.playerToPassValueMapping.get(player);
    return value === undefined ? this.defaultValue : value;
  }
}

class TestAttackingPositionValueCalculator
  implements IAttackPositionValueCalculator {
  private playerToAttackPositionValueMapping: Map<Player, number> = new Map([]);
  private defaultValue: number;

  setValue(player: Player, score: number): void {
    this.playerToAttackPositionValueMapping.set(player, score);
  }

  setDefaultValue(value: number): this {
    this.defaultValue = value;
    return this;
  }

  evaluate(player: Player): number {
    const value = this.playerToAttackPositionValueMapping.get(player);
    return value === undefined ? this.defaultValue : value;
  }
}

class TestTeamInControlCalculator implements ITeamInControlCalculator {
  private teamInControl: Team | null = null;

  public setTeamInControl(team: Team): void {
    this.teamInControl = team;
  }
  public getTeamInControl(): Team | null {
    return this.teamInControl;
  }
}


let player: Player;
let ball: Ball;
let passValueCalculator: TestPassValueCalculator;
let shotValueCalculator: IShotValueCalculator;
let positionValueCalculator: TestAttackingPositionValueCalculator;
let dribbleValueCalculator: IDribbleValueCalculator;
let defenceValueCalculator: IDefenceValueCalculator;
let possessionService: TestBallPossessionService;
let extractor: PlayerStateFeatureExtractor;
let teamInControlCalculator: TestTeamInControlCalculator;

describe('PlayerStateFeatureExtractor', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
    ball = new Ball(0, 0, 0, 0, 5);
    passValueCalculator = new TestPassValueCalculator().setDefaultValue(0.5);
    shotValueCalculator = {
      evaluate: (player: Player, shootingFrom?: Vector3D) => 0.5,
    }
    positionValueCalculator =
      new TestAttackingPositionValueCalculator().setDefaultValue(0.5);

    dribbleValueCalculator = {
      evaluate: (
        player: Player, endPositon: Vector3D, startPosition: Vector3D) => 0.5,
    }

    defenceValueCalculator = {
      evaluate: (player: Player, position: Vector3D) => 0.5,
    }

    teamInControlCalculator = new TestTeamInControlCalculator();

    possessionService = new TestBallPossessionService();
    extractor = new PlayerStateFeatureExtractor(
      ball,
      possessionService,
      passValueCalculator,
      shotValueCalculator,
      positionValueCalculator,
      dribbleValueCalculator,
      defenceValueCalculator,
      teamInControlCalculator,
    );
  });

  afterEach(() => {
    player = null;
    ball = null;
    passValueCalculator = null;
    shotValueCalculator = null;
    positionValueCalculator = null;
    dribbleValueCalculator = null;
    defenceValueCalculator = null;
    possessionService = null;
    teamInControlCalculator = null;
    extractor = null;
  });

  describe('`hasBall`', () => {
    it('returns true if the player hasBall', () => {
      sinon.stub(player, 'hasBall').returns(true);
      expect(extractor.hasBall(player)).to.be.true;
    });

    it('returns false if the player does not have the ball', () => {
      sinon.stub(player, 'hasBall').returns(false);
      expect(extractor.hasBall(player)).to.be.false;
    });
  });

  describe('`teamInControl`', () => {
    it('returns true if the player\'s team is in control', () => {
      const team = new Team([]);
      player.setTeam(team);
      teamInControlCalculator.setTeamInControl(team);

      expect(extractor.teamInControl(player)).to.be.true;

    });

    it('returns false if a different team is in control', () => {
      const teamA = new Team([]);
      const teamB = new Team([]);
      player.setTeam(teamA);
      teamInControlCalculator.setTeamInControl(teamB);

      expect(extractor.teamInControl(player)).to.be.false;
    });

    it('returns false if no team is in control', () => {
      player.setTeam(new Team([]));

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

      expect(extractor.bestPassingOption(player)).to.equal(mateTwo);
    });
  });

  describe('`receivedWaitMessage`', () => {
    it('returns true if the player has WAIT messages', () => {
      const message = {
        title: PLAYER_MESSAGES.WAIT,
        sender: new Player(0, 0, 0, 0, 0),
      } as IPlayerMessage;
      sinon.stub(player, 'getMessages').returns([message]);

      expect(extractor.receivedWaitMessage(player)).to.be.true;
    });

    it('returns false if the player does not have WAIT messages', () => {
      sinon.stub(player, 'getMessages').returns([]);

      expect(extractor.receivedWaitMessage(player)).to.be.false;
    });
  });

  describe('`expectedPassInterceptedOrCompleted`', () => {
    context('when the player has wait messages', () => {
      it('returns true if the player is in possesion (pass completed)', () => {
        const sender = new Player(0, 0, 0, 0, 0);
        const message = {
          title: PLAYER_MESSAGES.WAIT,
          sender: sender,
        } as IPlayerMessage;
        sinon.stub(player, 'getMessages').returns([message]);
        possessionService.setCurrent(player);

        expect(extractor.expectedPassInterceptedOrCompleted(player)).to.be.true;
      });

      it('returns true if another player is in possesion (pass intercepted)', () => {
        const sender = new Player(0, 0, 0, 0, 0);
        const interceptor = new Player(0, 0, 0, 0, 0);
        const message = {
          title: PLAYER_MESSAGES.WAIT,
          sender: sender,
        } as IPlayerMessage;
        sinon.stub(player, 'getMessages').returns([message]);
        possessionService.setCurrent(interceptor);

        expect(extractor.expectedPassInterceptedOrCompleted(player)).to.be.true;
      });

      it('returns false if the sender is with the ball', () => {
        const sender = new Player(0, 0, 0, 0, 0);
        const message = {
          title: PLAYER_MESSAGES.WAIT,
          sender: sender,
        } as IPlayerMessage;
        sinon.stub(player, 'getMessages').returns([message]);
        possessionService.setCurrent(sender);

        expect(
          extractor.expectedPassInterceptedOrCompleted(player)).to.be.false;
      });

      it('returns false if no player is currently in possession', () => {
        const sender = new Player(0, 0, 0, 0, 0);
        const message = {
          title: PLAYER_MESSAGES.WAIT,
          sender: sender,
        } as IPlayerMessage;
        sinon.stub(player, 'getMessages').returns([message]);
        possessionService.setCurrent(null);

        expect(
          extractor.expectedPassInterceptedOrCompleted(player)).to.be.false;
      });
    });

    context('when the player has no wait messages', () => {
      it('returns false', () => {
        sinon.stub(player, 'getMessages').returns([]);

        expect(
          extractor.expectedPassInterceptedOrCompleted(player)).to.be.false;
      });
    });
  });

  describe('`receivedPassRequest`', () => {
    it('returns true if there is a passRequest', () => {
      const message = {
        title: PLAYER_MESSAGES.PASS,
        sender: new Player(0, 0, 0, 0, 0),
      } as IPlayerMessage;
      sinon.stub(player, 'getMessages').returns([message]);

      expect(extractor.receivedPassRequest(player)).to.be.true;
    });

    it('returns false if there is no passRequest', () => {
      expect(extractor.receivedPassRequest(player)).to.be.false;
    });
  });

  describe('`getBestPositionedPassRequestSender`', () => {
    it('returns the passRequester with highest attackingPositionValue', () => {
      const requesterA = new Player(0, 0, 0, 0, 0);
      const requesterB = new Player(0, 0, 0, 0, 0);
      const messages = [requesterA, requesterB].map((requester) => {
        return {
          title: PLAYER_MESSAGES.PASS,
          sender: requester,
        } as IPlayerMessage;

      });
      sinon.stub(player, 'getMessages').returns(messages);
      passValueCalculator.setValue(requesterA, 0.6);
      passValueCalculator.setValue(requesterB, 0.8);

      expect(extractor.getBestPositionedPassRequestSender(player))
        .to.equal(requesterA);
    });
  });
});
