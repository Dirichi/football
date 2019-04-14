import { Player } from '../src/player';
import { PlayerPhysics } from '../src/player_physics';
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

describe('PlayerPhysics', () => {
  describe('`update`', () => {
    it('updates the player position with velocity if within the boundary', () => {
      const boundary = new TestBoundary();
      const containsCircleStub =
        sinon.stub(boundary, 'containsCircle').returns(true);

      const [x, y, vx, vy, speed, diameter] = [2, 3, 4, 8, 1, 5];
      const player = new Player(x, y, vx, vy, speed, diameter);
      const physics = new PlayerPhysics(boundary);
      player.setPhysics(physics);
      physics.update(player);
      expect([player.x, player.y]).to.eql([6, 11]);
      // the boundary should validate that nextX and nextY
      // (not currentX and currentY) are contained
      expect(containsCircleStub).to.have.been.calledWith(6, 11, 5);
    });

    it('ensures that the player does not get outside of its boundary', () => {
      const boundary = new TestBoundary();
      const containsCircleStub =
        sinon.stub(boundary, 'containsCircle').returns(false);

      const [x, y, vx, vy, speed, diameter] = [2, 3, 4, 8, 1, 5];
      const player = new Player(x, y, vx, vy, speed, diameter);
      const physics = new PlayerPhysics(boundary);
      player.setPhysics(physics);
      physics.update(player);
      expect([player.x, player.y]).to.eql([2, 3]);

      // the boundary should validate that nextX and nextY
      // (not currentX and currentY) are contained
      expect(containsCircleStub).to.have.been.calledWith(6, 11, 5);
    });

    it('stops the player when it hits a boundary', () => {
      const boundary = new TestBoundary();
      sinon.stub(boundary, 'containsCircle').returns(false);

      const [x, y, vx, vy, speed, diameter] = [2, 3, 4, 8, 1, 5];
      const player = new Player(x, y, vx, vy, speed, diameter);
      const physics = new PlayerPhysics(boundary);
      player.setPhysics(physics);
      physics.update(player);
      expect([player.vx, player.vy]).to.eql([0, 0]);
    });
  });
});
