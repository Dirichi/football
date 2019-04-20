import { Ball } from '../../src/game_objects/ball';
import { BallPhysics } from '../../src/physics/ball_physics';
import { TestEventQueue } from '../helpers/test_event_queue';
import { IBoundary } from '../../src/interfaces/iboundary';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

class TestBoundary implements IBoundary {
  containsCircle(x: number, y: number, diameter: number) {
    return true;
  }
}

let queue: TestEventQueue;
let boundary: TestBoundary;

describe('BallPhysics', () => {
  describe('`update`', () => {
    beforeEach(() => {
      queue = new TestEventQueue();
      boundary = new TestBoundary();
    });

    it('updates the ball position with velocity if within the boundary', () => {
      const containsCircleStub =
        sinon.stub(boundary, 'containsCircle').returns(true);

      const ballPhysics = new BallPhysics(boundary, queue);
      const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 5];
      const ball = new Ball(x, y, vx, vy, diameter);
      ballPhysics.setBall(ball);
      ballPhysics.update();
      expect([ball.x, ball.y]).to.eql([6, 11]);
      // the boundary should validate that nextX and nextY
      // (not currentX and currentY) are contained
      expect(containsCircleStub).to.have.been.calledWith(6, 11, 5);
    });

    it('ensures that the ball does not get outside of its boundary', () => {
      const containsCircleStub =
        sinon.stub(boundary, 'containsCircle').returns(false);

      const ballPhysics = new BallPhysics(boundary, queue);
      const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 5];
      const ball = new Ball(x, y, vx, vy, diameter);
      ballPhysics.setBall(ball);

      ballPhysics.update();
      expect([ball.x, ball.y]).to.eql([2, 3]);

      // the boundary should validate that nextX and nextY
      // (not currentX and currentY) are contained
      expect(containsCircleStub).to.have.been.calledWith(6, 11, 5);
    });

    it('stops the ball when it hits a boundary', () => {
      sinon.stub(boundary, 'containsCircle').returns(false);

      const ballPhysics = new BallPhysics(boundary, queue);
      const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 5];
      const ball = new Ball(x, y, vx, vy, diameter);
      ballPhysics.setBall(ball);

      ballPhysics.update();
      expect([ball.vx, ball.vy]).to.eql([0, 0]);
    });

    it('updates the velocity of the player based on friction', () => {
      sinon.stub(boundary, 'containsCircle').returns(true);

      const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 5];
      const ball = new Ball(x, y, vx, vy, diameter);
      const physics = new BallPhysics(boundary, queue);
      physics.setFriction(0.1);
      physics.setBall(ball);

      physics.update();
      expect([ball.vx, ball.vy]).to.eql([3.6, 7.2]);
    });
  });

  describe('`setPlayer`', () => {
    context('when the player collides with a ball', () => {
      beforeEach(() => {
        queue = new TestEventQueue();
        boundary = new TestBoundary();
      });

      afterEach(() => {
        queue = null;
        boundary = null;
      });

      it('sets the ball position and velocity with the passed params', () => {
        const [x, y, vx, vy, diameter] = [0, 0, 0, 0, 5];
        const ball = new Ball(x, y, vx, vy, diameter);
        const physics = new BallPhysics(boundary, queue);
        physics.setBall(ball);

        queue.trigger(`ball.control`, { newX: 2, newY: 3, newVx: 4, newVy: 8 });
        expect([ball.x, ball.y, ball.vx, ball.vy]).to.eql([2, 3, 4, 8]);
      });
    });
  });
});
