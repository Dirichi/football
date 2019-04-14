import { Ball } from '../../src/ball';
import { BallPossessionService } from '../../src/services/ball_possession_service';
import { Player } from '../../src/player';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('BallPossessionService', () => {
  describe('`getPlayerInPossession`', () => {
    it('returns the player in possession of the ball', () => {
      const playerA = new Player(1, 1, 0, 0, 1, 2); // x, y, vx, vy, speed, diameter
      const playerB = new Player(5, 0, 0, 0, 1, 2); // x, y, vx, vy, speed, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter

      const service = new BallPossessionService(ball, [playerA, playerB]);
      const player = service.getPlayerInPossession();
      expect(player).to.equal(playerA);
    });

    it('returns null if there is no player in possession', () => {
      const playerA = new Player(5, 0, 0, 0, 1, 2); // x, y, vx, vy, speed, diameter
      const playerB = new Player(5, 0, 0, 0, 1, 2); // x, y, vx, vy, speed, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter

      const service = new BallPossessionService(ball, [playerA, playerB]);
      const player = service.getPlayerInPossession();
      expect(player).to.be.null;
    });
  });
});
