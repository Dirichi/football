import { Player } from '../../src/game_objects/player';
import { IPlayerBallInteractionMediator } from '../../src/interfaces/iplayer_ball_interaction_mediator';
import { IPlayerController } from '../../src/interfaces/iplayer_controller';
import { Team } from '../../src/game_objects/team';
import { EventQueue } from '../../src/event_queue';
import { Vector3D } from '../../src/three_dimensional_vector';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

class TestPlayerBallInteractionMediator implements IPlayerBallInteractionMediator {
  hasBall(player: Player): boolean {
    return true;
  }

  kickBall(player: Player, destination: Vector3D): boolean {
    return true;
  }

  controlBall(player: Player): boolean {
    return true;
  }

  chaseBall(player: Player): void {}

  trackBall(player: Player): void {}
}

class TestController implements IPlayerController {
  update() {}
  enable() {}
  disable() {}
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
    it('stores messages', () => {
      const queue = new EventQueue();
      const player = new Player(0, 0, 0, 0, 5);
      player.setMessageQueue(queue);
      const message = {title: 'messageTitle', sender: player};

      queue.trigger(`player.${player.getGameObjectId()}.messaged`, message);

      expect(player.getMessages()).to.eql([message]);
    });
  });

  describe('`kickBall`', () => {
    it('calls `kickBall` on the ballInteractionMediator', () => {
      const player = new Player(0, 0, 0, 0, 5);
      const mediator = new TestPlayerBallInteractionMediator();
      const destination = new Vector3D(5, 5, 0);
      player.setBallInteractionMediator(mediator);
      sinon.stub(mediator, 'kickBall');

      player.kickBall(destination);

      expect(mediator.kickBall).to.have.been.calledWith(player, destination);
    });

    it('returns true if the ball was kicked', () => {
      const player = new Player(0, 0, 0, 0, 5);
      const mediator = new TestPlayerBallInteractionMediator();
      const destination = new Vector3D(5, 5, 0);
      player.setBallInteractionMediator(mediator);
      sinon.stub(mediator, 'kickBall').returns(true);

      expect(player.kickBall(destination)).to.be.true;
    });

    it('returns false if the ball was not kicked', () => {
      const player = new Player(0, 0, 0, 0, 5);
      const mediator = new TestPlayerBallInteractionMediator();
      const destination = new Vector3D(5, 5, 0);
      player.setBallInteractionMediator(mediator);
      sinon.stub(mediator, 'kickBall').returns(false);

      expect(player.kickBall(destination)).to.be.false;
    });
  });

  describe('`controlBall`', () => {
    it('delegates ball control to the ballInteractionMediator', () => {
      const player = new Player(0, 0, 0, 0, 5);
      const mediator = new TestPlayerBallInteractionMediator();
      player.setBallInteractionMediator(mediator);
      sinon.stub(mediator, 'controlBall').returns(true);

      expect(player.controlBall()).to.be.true;
    });

    it('does not call the mediator if ball control is disabled', () => {
      const player = new Player(0, 0, 0, 0, 5);
      const controller = new TestController();
      const mediator = new TestPlayerBallInteractionMediator();
      player.setController(controller);
      player.setBallInteractionMediator(mediator);
      player.disableControls();
      sinon.stub(mediator, 'controlBall');

      player.controlBall();

      expect(mediator.controlBall).not.to.have.been.called;
    });

    it('returns false if controls are disabled', () => {
      const player = new Player(0, 0, 0, 0, 5);
      const controller = new TestController();
      const mediator = new TestPlayerBallInteractionMediator();
      player.setController(controller);
      player.setBallInteractionMediator(mediator);
      player.disableControls();

      expect(player.controlBall()).to.be.false;
    });

    it('is re-enabled when controls are re-enabled', () => {
      const player = new Player(0, 0, 0, 0, 5);
      const mediator = new TestPlayerBallInteractionMediator();
      const controller = new TestController();
      player.setController(controller);
      player.setBallInteractionMediator(mediator);
      sinon.stub(mediator, 'controlBall').returns(true);
      player.disableControls();
      player.enableControls();

      expect(player.controlBall()).to.be.true;
    });
  });

  describe('`disableControls`', () => {
    it('disables the controller', () => {
      const player = new Player(0, 0, 0, 0, 5);
      const controller = new TestController();
      player.setController(controller);
      sinon.stub(controller, 'disable');
      player.disableControls();

      expect(controller.disable).to.have.been.called;
    });
  });

  describe('`enableControls`', () => {
    it('enables the controller', () => {
      const player = new Player(0, 0, 0, 0, 5);
      const controller = new TestController();
      player.setController(controller);
      sinon.stub(controller, 'enable');

      player.enableControls();

      expect(controller.enable).to.have.been.called;
    });
  });
});
