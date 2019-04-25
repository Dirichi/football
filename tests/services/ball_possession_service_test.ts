import { Ball } from '../../src/game_objects/ball';
import { BallPossessionService } from '../../src/services/ball_possession_service';
import { Player } from '../../src/game_objects/player';
import { ThreeDimensionalVector } from '../../src/three_dimensional_vector';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('BallPossessionService', () => {
  describe('`getCurrentPlayerInPossessionOrNull`', () => {
    it('returns the player in possession of the ball', () => {
      const playerA = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const playerB = new Player(5, 0, 0, 0, 2); // x, y, vx, vy, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter

      const service = new BallPossessionService(ball, [playerA, playerB]);
      service.update();
      const player = service.getCurrentPlayerInPossessionOrNull();
      expect(player).to.equal(playerA);
    });

    it('returns null if there is no player in possession', () => {
      const playerA = new Player(5, 0, 0, 0, 2); // x, y, vx, vy, diameter
      const playerB = new Player(5, 0, 0, 0, 2); // x, y, vx, vy, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter

      const service = new BallPossessionService(ball, [playerA, playerB]);
      service.update();
      const player = service.getCurrentPlayerInPossessionOrNull();
      expect(player).to.be.null;
    });
  });

  describe('`getLastPlayerInPossession`', () => {
    it('returns the last (non-null) player in possession of the ball', () => {
      const playerA = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const playerB = new Player(5, 0, 0, 0, 2); // x, y, vx, vy, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter

      const service = new BallPossessionService(ball, [playerA, playerB]);
      service.update();

      // move ball away from player A
      sinon.stub(ball, 'getPosition')
        .returns(new ThreeDimensionalVector(-1, 0, 0));

      const player = service.getLastPlayerInPossession();
      expect(player).to.equal(playerA);
    });
  });
});
