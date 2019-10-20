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

let boundary: TestBoundary;

describe('PlayerPhysics', () => {
  describe('`update`', () => {
    beforeEach(() => {
      boundary = new TestBoundary();
    });

    afterEach(() => {
      boundary = null;
    });

    it('updates the player position with velocity if within the boundary', () => {
      sinon.stub(boundary, 'containsCircle').withArgs(6, 11, 5).returns(true);

      const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 5];
      const player = new Player(x, y, vx, vy, diameter);
      const physics = new PlayerPhysics(boundary);

      physics.update(player);
      expect([player.x, player.y]).to.eql([6, 11]);
    });

    it('ensures that the player does not get outside of its boundary', () => {
      sinon.stub(boundary, 'containsCircle').withArgs(6, 11, 5).returns(false);

      const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 5];
      const player = new Player(x, y, vx, vy, diameter);
      const physics = new PlayerPhysics(boundary);

      physics.update(player);
      expect([player.x, player.y]).to.eql([2, 3]);
    });

    it('stops the player when it hits a boundary', () => {
      sinon.stub(boundary, 'containsCircle').returns(false);

      const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 5];
      const player = new Player(x, y, vx, vy, diameter);
      const physics = new PlayerPhysics(boundary);

      physics.update(player);
      expect([player.vx, player.vy]).to.eql([0, 0]);
    });

    it('updates the velocity of the player based on friction', () => {
      sinon.stub(boundary, 'containsCircle').returns(true);

      const [x, y, vx, vy, diameter] = [2, 3, 4, 8, 5];
      const player = new Player(x, y, vx, vy, diameter);
      const physics = new PlayerPhysics(boundary).setFriction(0.1);

      physics.update(player);
      expect([player.vx, player.vy]).to.eql([3.6, 7.2]);
    });
  });
});
