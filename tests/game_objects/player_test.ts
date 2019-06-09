import { Ball } from '../../src/game_objects/ball';
import { Player } from '../../src/game_objects/player';
import { IPlayerController } from '../../src/interfaces/iplayer_controller';
import { IPlayerBallInteractionMediator } from '../../src/interfaces/iplayer_ball_interaction_mediator';
import { Team } from '../../src/game_objects/team';
import { EventQueue } from '../../src/event_queue';
import { ThreeDimensionalVector } from '../../src/three_dimensional_vector';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

class TestPlayerBallInteractionMediator implements IPlayerBallInteractionMediator {
  hasBall(player: Player): boolean {
    return true;
  }

  kickBall(player: Player, destination: ThreeDimensionalVector): boolean {
    return true;
  }

  controlBall(player: Player): boolean {
    return true;
  }

  chaseBall(player: Player): void {}
}

describe('Player', () => {
  describe('`getNearestTeamMate`', () => {
    it('returns the nearest player', () => {
      const playerA = new Player(0, 0, 3, 3, 5);
      const playerB = new Player(1, 2, 3, 3, 5);
      const playerC = new Player(3, 2, 3, 3, 5);

      const team = new Team([playerA, playerB, playerC]);

      expect(playerA.getNearestTeamMate()).to.equal(playerB);
    });

    it('returns null if there are no teammates', () => {
      const playerA = new Player(0, 0, 3, 3, 5);
      const team = new Team([playerA]);

      expect(playerA.getNearestTeamMate()).to.be.null;
    });
  });

  describe('`setMessageQueue`', () => {
    it('passes player messages to its controller', () => {
      class TestController implements IPlayerController {
        update() {}
        handleMessage(message: {details: string}) {}
        enable() {}
        disable() {}
      }

      const queue = new EventQueue();
      const player = new Player(0, 0, 0, 0, 5);
      const controller = new TestController();
      player.setController(controller);
      player.setMessageQueue(queue);
      sinon.spy(controller, 'handleMessage');

      queue.trigger(`player.${player.getGameObjectId()}.messaged`,
        {details: 'message'});

      expect(controller.handleMessage).to.have.been.calledWith(
        {details: 'message'});
    });
  });

  describe('`feetPosition`', () => {
    it('returns the unit of the last non-zero velocity scaled by player' +
      ' radius offset by current position', () => {
        const player = new Player(3, 6, 0, 0, 5);
        player.setMaximumSpeed(10);
        player.moveUp();
        player.stop();

        const position = player.feetPosition();
        const expectedPosition = new ThreeDimensionalVector(3, 3.5, 0);
        expect(position.equals(expectedPosition)).to.be.true;
      });

    it('returns the unit of the last non-zero velocity scaled by player' +
      ' radius offset by current position', () => {
        const player = new Player(3, 6, 0, 0, 5);
        player.setMaximumSpeed(10);
        player.moveTowards(new ThreeDimensionalVector(13, 6, 0));
        player.stop();

        const position = player.feetPosition();
        const expectedPosition = new ThreeDimensionalVector(5.5, 6, 0);
        expect(position.equals(expectedPosition)).to.be.true;
      });

    it('defaults to a random direction if no non-zero velocity has been' +
      ' recorded', () => {
        const player = new Player(3, 6, 0, 0, 5);
        player.setMaximumSpeed(10);
        player.stop();
        // generate a (1, 0) vector 'at random';
        const randomStub =
          sinon.stub(ThreeDimensionalVector, 'random2D').returns(
            new ThreeDimensionalVector(1, 0, 0));

        const position = player.feetPosition();
        const expectedPosition = new ThreeDimensionalVector(5.5, 6, 0);
        expect(position.equals(expectedPosition)).to.be.true;
        randomStub.restore();
      });

    it('memoizes the provided random direction when no non-zero velocity was' +
      ' previously recorded', () => {
        const player = new Player(3, 6, 0, 0, 5);
        player.setMaximumSpeed(10);
        player.stop();
        // generate a (1, 0) vector 'at random';
        const randomStub =
          sinon.stub(ThreeDimensionalVector, 'random2D').onCall(0).returns(
            new ThreeDimensionalVector(1, 0, 0));
        // first call
        player.feetPosition();

        // second call should not change feetPosition
        const position = player.feetPosition();
        const expectedPosition = new ThreeDimensionalVector(5.5, 6, 0);
        expect(position.equals(expectedPosition)).to.be.true;
        randomStub.restore();
      });
  });

  describe('`kickBall`', () => {
    it('calls `kickBall` on the ballInteractionMediator', () => {
      const player = new Player(0, 0, 0, 0, 5);
      const mediator = new TestPlayerBallInteractionMediator();
      const destination = new ThreeDimensionalVector(5, 5, 0);
      player.setBallInteractionMediator(mediator);
      sinon.stub(mediator, 'kickBall');

      player.kickBall(destination);

      expect(mediator.kickBall).to.have.been.calledWith(player, destination);
    });

    it('returns true if the ball was kicked', () => {
      const player = new Player(0, 0, 0, 0, 5);
      const mediator = new TestPlayerBallInteractionMediator();
      const destination = new ThreeDimensionalVector(5, 5, 0);
      player.setBallInteractionMediator(mediator);
      sinon.stub(mediator, 'kickBall').returns(true);

      expect(player.kickBall(destination)).to.be.true;
    });

    it('returns false if the ball was not kicked', () => {
      const player = new Player(0, 0, 0, 0, 5);
      const mediator = new TestPlayerBallInteractionMediator();
      const destination = new ThreeDimensionalVector(5, 5, 0);
      player.setBallInteractionMediator(mediator);
      sinon.stub(mediator, 'kickBall').returns(false);

      expect(player.kickBall(destination)).to.be.false;
    });
  });
});
