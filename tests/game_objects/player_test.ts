import { Ball } from '../../src/game_objects/ball';
import { Player } from '../../src/game_objects/player';
import { IPlayerController } from '../../src/interfaces/iplayer_controller';
import { Team } from '../../src/game_objects/team';
import { EventQueue } from '../../src/event_queue';
import { ThreeDimensionalVector } from '../../src/three_dimensional_vector';
import { BALL_CONTROL_REFRESH_TIME } from "../../src/constants";
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

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

  describe('`temporarilyDisableBallControl`', () => {
    beforeEach(() => {
      this.clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      this.clock.restore();
    });

    it('sets ballControlEnabled to false', () => {
      const player = new Player(0, 0, 0, 0, 5);
      expect(player.ballControlIsDisabled()).to.be.false;
      player.temporarilyDisableBallControl();

      expect(player.ballControlIsDisabled()).to.be.true;
    });

    it('re-enables ball control after a delay', () => {
      const player = new Player(0, 0, 0, 0, 5);
      player.temporarilyDisableBallControl();
      expect(player.ballControlIsDisabled()).to.be.true;

      this.clock.tick(BALL_CONTROL_REFRESH_TIME);
      expect(player.ballControlIsDisabled()).to.be.false;
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

    it('records when the player is in possession', () => {
      const queue = new EventQueue();
      const player = new Player(0, 0, 0, 0, 5);
      player.setMessageQueue(queue);

      queue.trigger(`player.${player.getGameObjectId()}.ballPossession`,
        {possession: true});

      expect(player.hasBall()).to.be.true;
    });

    it('records when the player is not in possession', () => {
      const queue = new EventQueue();
      const player = new Player(0, 0, 0, 0, 5);
      player.setMessageQueue(queue);

      queue.trigger(`player.${player.getGameObjectId()}.ballPossession`,
        {possession: false});

      expect(player.hasBall()).to.be.false;
    });
  });

  describe('`kickBall`', () => {
    it('moves the ball to the desired destination', () => {
      const queue = new EventQueue();
      const player = new Player(0, 0, 0, 0, 5);
      const ball = new Ball(0, 0, 0, 0, 1);
      player.setMessageQueue(queue);
      // Give player possession of ball
      queue.trigger(`player.${player.getGameObjectId()}.ballPossession`,
        {possession: true});
      sinon.spy(ball, 'moveTowards');

      const destination = new ThreeDimensionalVector(5, 5, 0);
      player.kickBall(ball, destination);

      expect(ball.moveTowards).to.have.been.calledWith(destination);
    });

    it('does not move the ball if the player is not in possession', () => {
      const queue = new EventQueue();
      const player = new Player(0, 0, 0, 0, 5);
      const ball = new Ball(0, 0, 0, 0, 1);
      player.setMessageQueue(queue);
      // Player does not have possession
      queue.trigger(`player.${player.getGameObjectId()}.ballPossession`,
        {possession: false});
      sinon.spy(ball, 'moveTowards');

      const destination = new ThreeDimensionalVector(5, 5, 0);
      player.kickBall(ball, destination);

      expect(ball.moveTowards).not.to.have.been.called;
    });

    it('temporarily disables kicking', () => {
      const queue = new EventQueue();
      const player = new Player(0, 0, 0, 0, 5);
      const ball = new Ball(0, 0, 0, 0, 1);
      player.setMessageQueue(queue);
      // Give player possession of ball
      queue.trigger(`player.${player.getGameObjectId()}.ballPossession`,
        {possession: true});

      const destinationOne = new ThreeDimensionalVector(5, 5, 0);
      player.kickBall(ball, destinationOne);

      const destinationTwo = new ThreeDimensionalVector(15, 15, 0);
      player.kickBall(ball, destinationTwo);
      sinon.spy(ball, 'moveTowards');

      expect(ball.moveTowards).not.to.have.been.called;
    });

    it('returns true if the ball was kicked', () => {
      const queue = new EventQueue();
      const player = new Player(0, 0, 0, 0, 5);
      const ball = new Ball(0, 0, 0, 0, 1);
      player.setMessageQueue(queue);
      // Give player possession of ball
      queue.trigger(`player.${player.getGameObjectId()}.ballPossession`,
        {possession: true});

      const destination = new ThreeDimensionalVector(5, 5, 0);
      expect(player.kickBall(ball, destination)).to.be.true;
    });

    it('returns false if the ball was not kicked', () => {
      const queue = new EventQueue();
      const player = new Player(0, 0, 0, 0, 5);
      const ball = new Ball(0, 0, 0, 0, 1);
      player.setMessageQueue(queue);
      // Give player possession of ball
      queue.trigger(`player.${player.getGameObjectId()}.ballPossession`,
        {possession: false});

      const destination = new ThreeDimensionalVector(5, 5, 0);
      expect(player.kickBall(ball, destination)).to.be.false;
    });

    it('returns false if kicking is disabled', () => {
      const queue = new EventQueue();
      const player = new Player(0, 0, 0, 0, 5);
      const ball = new Ball(0, 0, 0, 0, 1);
      player.setMessageQueue(queue);
      // Give player possession of ball
      queue.trigger(`player.${player.getGameObjectId()}.ballPossession`,
        {possession: true});

      const destinationOne = new ThreeDimensionalVector(5, 5, 0);
      player.kickBall(ball, destinationOne);

      const destinationTwo = new ThreeDimensionalVector(15, 15, 0);
      expect(player.kickBall(ball, destinationTwo)).to.be.false;
    });
  });
});
