import { Ball } from '../src/ball';
import { BallPhysics } from '../src/ball_physics';
import { IBoundary } from '../src/iboundary';
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

describe('BallPhysics', () => {
  describe('`update`', () => {
    it('updates the ball position with velocity if within the boundary', () => {
      const boundary = new TestBoundary();
      sinon.stub(boundary, 'containsCircle').returns(true);

      const ballPhysics = new BallPhysics(boundary);
      const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 5];
      const ball = new Ball(x, y, vx, vy, diameter);
      ballPhysics.update(ball);
      expect([ball.x, ball.y]).to.eql([6, 11]);
    });

    it('ensures that the ball does not get outside of its boundary', () => {
      const boundary = new TestBoundary();
      sinon.stub(boundary, 'containsCircle').returns(false);

      const ballPhysics = new BallPhysics(boundary);
      const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 5];
      const ball = new Ball(x, y, vx, vy, diameter);
      ballPhysics.update(ball);
      expect([ball.x, ball.y]).to.eql([2, 3]);
    });

    it('stops the ball when it hits a boundary', () => {
      const boundary = new TestBoundary();
      sinon.stub(boundary, 'containsCircle').returns(false);

      const ballPhysics = new BallPhysics(boundary);
      const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 5];
      const ball = new Ball(x, y, vx, vy, diameter);
      ballPhysics.update(ball);
      expect([ball.vx, ball.vy]).to.eql([0, 0]);
    });
  });
});