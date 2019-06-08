import { Ball } from '../../src/game_objects/ball';
import { Player } from '../../src/game_objects/player';
import { PlayerBallInteractionMediator } from '../../src/services/player_ball_interaction_mediator';
import { ThreeDimensionalVector } from '../../src/three_dimensional_vector';
import { TestBallPossessionService } from '../helpers/test_ball_possession_service';
import { TestTickService } from '../helpers/test_tick_service';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let ball: Ball | null = null;
let player: Player | null = null;
let tickService: TestTickService | null;
const kickDisabledTimeout = 15;

describe('PlayerBallInteractionMediator', () => {
  beforeEach(() => {
    ball = new Ball(0, 0, 0, 0, 5);
    player = new Player(0, 0, 0, 0, 5);
    tickService = new TestTickService();
  });

  afterEach(() => {
    ball = null;
    player = null;
    tickService = null;
  });

  describe('`hasBall`', () => {
    it('returns true if the passed in player is in possession', () => {
      const possessionService = new TestBallPossessionService(player);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);

      expect(mediator.hasBall(player)).to.be.true;
    });

    it('returns false if the passed in player is in possession', () => {
      const otherPlayer = new Player(10, 10, 0, 0, 5);
      const possessionService = new TestBallPossessionService(otherPlayer);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);

      expect(mediator.hasBall(player)).to.be.false;
    });

    it('returns false if no player is in possession', () => {
      const possessionService = new TestBallPossessionService(null);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);

      expect(mediator.hasBall(player)).to.be.false;
    });
  });

  describe('`controlBall`', () => {
    it('repositions the ball to be at the player\'s feet', () => {
      const possessionService = new TestBallPossessionService(player);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);
      const position = new ThreeDimensionalVector(10, 10, 0);
      sinon.spy(ball, 'reposition');
      sinon.stub(player, 'feetPosition').returns(position);

      mediator.controlBall(player);
      expect(ball.reposition).to.have.been.calledWith(position);
    });

    it('stops the ball', () => {
      const possessionService = new TestBallPossessionService(player);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);
      sinon.spy(ball, 'stop');

      mediator.controlBall(player);
      expect(ball.stop).to.have.been.called;
    });

    it('returns true if the player can kick the ball', () => {
      const possessionService = new TestBallPossessionService(player);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);

      expect(mediator.controlBall(player)).to.be.true;
    });

    it('does not reposition the ball if the player is not in possession',
      () => {
        const possessionService = new TestBallPossessionService(null);
        const mediator = new PlayerBallInteractionMediator(
          ball, possessionService, tickService, kickDisabledTimeout);
        sinon.spy(ball, 'reposition');

        mediator.controlBall(player);

        expect(ball.reposition).not.to.have.been.called;
      });

    it('does not stop the ball if the player is not in possession', () => {
      const possessionService = new TestBallPossessionService(null);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);
      sinon.spy(ball, 'stop');

      mediator.controlBall(player);

      expect(ball.stop).not.to.have.been.called;
    });

    it('returns false if the player is not in possession', () => {
      const possessionService = new TestBallPossessionService(null);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);

      expect(mediator.controlBall(player)).to.be.false;
    });

    it('does not reposition the ball if the player recently kicked it', () => {
      const possessionService = new TestBallPossessionService(player);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);

      mediator.kickBall(player, new ThreeDimensionalVector(5, 5, 0));
      sinon.spy(ball, 'reposition');

      mediator.controlBall(player);

      expect(ball.reposition).not.to.have.been.called;
    });

    it('does not stop the ball if the player recently kicked it', () => {
      const possessionService = new TestBallPossessionService(player);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);

      mediator.kickBall(player, new ThreeDimensionalVector(5, 5, 0));
      sinon.spy(ball, 'stop');

      mediator.controlBall(player);

      expect(ball.stop).not.to.have.been.called;
    });

    it('returns false if the player recently kicked the ball', () => {
      const possessionService = new TestBallPossessionService(player);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);

      mediator.kickBall(player, new ThreeDimensionalVector(5, 5, 0));
      expect(mediator.controlBall(player)).to.be.false;
    });

    it('reenables ball control a period of time after kicking', () => {
      const possessionService = new TestBallPossessionService(player);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);

      mediator.kickBall(player, new ThreeDimensionalVector(5, 5, 0));
      tickService.fastForward(kickDisabledTimeout + 1);
      const position = new ThreeDimensionalVector(10, 10, 0);
      sinon.spy(ball, 'reposition');
      sinon.stub(player, 'feetPosition').returns(position);

      mediator.controlBall(player);

      expect(ball.reposition).to.have.been.calledOnceWith(position);
    });
  });

  describe('`kickBall`', () => {
    it('moves the ball in the desired direction', () => {
      const possessionService = new TestBallPossessionService(player);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);
      const direction = new ThreeDimensionalVector(2, 2, 0);
      sinon.spy(ball, 'moveTowards');

      mediator.kickBall(player, direction);
      expect(ball.moveTowards).to.have.been.calledWith(direction);
    });

    it('returns true if the ball was kicked', () => {
      const possessionService = new TestBallPossessionService(player);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);
      const direction = new ThreeDimensionalVector(2, 2, 0);

      expect(mediator.kickBall(player, direction)).to.be.true;
    });

    it('does not move the ball if the player is not in possession', () => {
      const possessionService = new TestBallPossessionService(null);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);
      const direction = new ThreeDimensionalVector(2, 2, 0);
      sinon.spy(ball, 'moveTowards');

      mediator.kickBall(player, direction);
      expect(ball.moveTowards).not.to.have.been.calledWith(direction);
    });

    it('returns false if the player is not in possession', () => {
      const possessionService = new TestBallPossessionService(null);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);
      const direction = new ThreeDimensionalVector(2, 2, 0);

      expect(mediator.kickBall(player, direction)).to.be.false;
    });

    it('prevents double kicks by temporarily disabling kicking', () => {
      const possessionService = new TestBallPossessionService(player);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);
      const direction = new ThreeDimensionalVector(2, 2, 0);
      mediator.kickBall(player, direction);
      sinon.spy(ball, 'moveTowards');

      mediator.kickBall(player, direction);

      expect(ball.moveTowards).not.to.have.been.calledWith(direction);
    });

    it('returns false if kicking is disabled', () => {
      const possessionService = new TestBallPossessionService(player);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);
      const direction = new ThreeDimensionalVector(2, 2, 0);
      mediator.kickBall(player, direction);

      expect(mediator.kickBall(player, direction)).to.be.false;
    });

    it('reenables kicking after a period of time', () => {
      const possessionService = new TestBallPossessionService(player);
      const mediator = new PlayerBallInteractionMediator(
        ball, possessionService, tickService, kickDisabledTimeout);
      const direction = new ThreeDimensionalVector(2, 2, 0);
      mediator.kickBall(player, direction);
      sinon.spy(ball, 'moveTowards');
      tickService.fastForward(kickDisabledTimeout + 1);

      mediator.kickBall(player, direction);

      expect(ball.moveTowards).to.have.been.calledWith(direction);
    });
  });
});
