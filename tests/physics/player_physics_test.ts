import { TestEventQueue } from '../helpers/test_event_queue';
import { ThreeDimensionalVector } from '../../src/three_dimensional_vector';
import { Player } from '../../src/game_objects/player';
import { PlayerPhysics } from '../../src/physics/player_physics';
import { IBoundary } from '../../src/interfaces/iboundary';
import { ICircle } from '../../src/interfaces/icircle';
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

describe('PlayerPhysics', () => {
  describe('`update`', () => {
    beforeEach(() => {
      queue = new TestEventQueue();
      boundary = new TestBoundary();
    });

    afterEach(() => {
      queue = null;
      boundary = null;
    });

    it('updates the player position with velocity if within the boundary', () => {
      sinon.stub(boundary, 'containsCircle').withArgs(6, 11, 5).returns(true);

      const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 5];
      const player = new Player(x, y, vx, vy, diameter);
      const physics = new PlayerPhysics(boundary, queue);
      player.setPhysics(physics);

      physics.update();
      expect([player.x, player.y]).to.eql([6, 11]);
    });

    it('ensures that the player does not get outside of its boundary', () => {
      sinon.stub(boundary, 'containsCircle').withArgs(6, 11, 5).returns(false);

      const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 5];
      const player = new Player(x, y, vx, vy, diameter);
      const physics = new PlayerPhysics(boundary, queue);
      player.setPhysics(physics);

      physics.update();
      expect([player.x, player.y]).to.eql([2, 3]);
    });

    it('stops the player when it hits a boundary', () => {
      sinon.stub(boundary, 'containsCircle').returns(false);

      const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 5];
      const player = new Player(x, y, vx, vy, diameter);
      const physics = new PlayerPhysics(boundary, queue);
      player.setPhysics(physics);

      physics.update();
      expect([player.vx, player.vy]).to.eql([0, 0]);
    });

    it('updates the velocity of the player based on friction', () => {
      sinon.stub(boundary, 'containsCircle').returns(true);

      const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 5];
      const player = new Player(x, y, vx, vy, diameter);
      const physics = new PlayerPhysics(boundary, queue);
      physics.setFriction(0.1);
      player.setPhysics(physics);

      physics.update();
      expect([player.vx, player.vy]).to.eql([3.6, 7.2]);
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

      it('publishes a message to stop and reposition the ball', () => {
        const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 6];
        const player = new Player(x, y, vx, vy, diameter);
        const physics = new PlayerPhysics(boundary, queue);
        physics.setPlayer(player);

        const circle = {
          kind: 'circle',
          getCentre: () => new ThreeDimensionalVector(2, 5, 0),
          getDiameter: () => 2,
        } as ICircle;

        queue.trigger(`${player.getGameObjectId()}.collision`,
          { colliderType: 'ball', shape: circle });

        const newX = (4 / Math.sqrt(5)) + 2;
        const newY = (8 / Math.sqrt(5)) + 3;
        const expected = {
          newX: newX,
          newY: newY,
          newVx: 0,
          newVy: 0,
        };
        expect(queue.triggeredEvents.get('ball.control')).to.eql([expected]);
      });

      it('does not control the ball if the player has ball control disabled',
        () => {
          const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 6];
          const player = new Player(x, y, vx, vy, diameter);
          const physics = new PlayerPhysics(boundary, queue);
          physics.setPlayer(player);

          sinon.stub(player, 'ballControlIsEnabled').returns(false);

          const circle = {
            kind: 'circle',
            getCentre: () => new ThreeDimensionalVector(2, 5, 0),
            getDiameter: () => 2,
          } as ICircle;

          queue.trigger(`${player.getGameObjectId()}.collision`,
            { colliderType: 'ball', shape: circle });

          expect(queue.triggeredEvents.get('ball.control')).to.be.undefined;
      });

      it('does not reposition the ball if the player is stationary', () => {
        const [x, y, vx, vy, diameter] = [2, 3, 0, 0, 6];
        const player = new Player(x, y, vx, vy, diameter);
        const physics = new PlayerPhysics(boundary, queue);
        physics.setPlayer(player);

        const circle = {
          kind: 'circle',
          getCentre: () => new ThreeDimensionalVector(2, 5, 0),
          getDiameter: () => 2,
        } as ICircle;

        queue.trigger(`${player.getGameObjectId()}.collision`,
          { colliderType: 'ball', shape: circle });

        const newX = (4 / Math.sqrt(5)) + 2;
        const newY = (8 / Math.sqrt(5)) + 3;
        const expected = {
          newX: 2,
          newY: 5,
          newVx: 0,
          newVy: 0,
        };
        expect(queue.triggeredEvents.get('ball.control')).to.eql([expected]);
      });
    });
  });
});
