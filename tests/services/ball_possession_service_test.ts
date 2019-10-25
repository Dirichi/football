import { Ball } from '../../src/game_objects/ball';
import { BallPossessionService } from '../../src/services/ball_possession_service';
import { Player } from '../../src/game_objects/player';
import { TestEventQueue } from '../helpers/test_event_queue';
import * as chai from 'chai';
import * as sinon from 'sinon';

import sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let ball: Ball;
let queue: TestEventQueue;

describe('BallPossessionService', () => {
  beforeEach(() => {
    ball = new Ball(0, 0, 0, 0, 2);
    queue = new TestEventQueue();
  });

  afterEach(() => {
    ball = null;
    queue = null;
  });

  describe('`update`', () => {
    it('sets playerInPossession to the closest player in contact with the ball',
      () => {
      const playerA = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const playerB = new Player(0.5, 0.5, 0, 0, 2); // x, y, vx, vy, diameter
      const service =
        new BallPossessionService(ball, [playerA, playerB], queue);

      service.update();

      expect(service.getCurrentPlayerInPossessionOrNull()).to.equal(playerB);
    });

    it('sets lastPlayerInPossession to the most recent playerInPossession',
      () => {
      const playerA = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const playerB = new Player(0.5, 0.5, 0, 0, 2); // x, y, vx, vy, diameter
      const service =
        new BallPossessionService(ball, [playerA, playerB], queue);
      service.update();
      [playerA.x, playerA.y] = [5, 5];
      [playerB.x, playerB.y] = [5, 5];

      service.update();

      expect(service.getLastPlayerInPossession()).to.equal(playerB);
    });


    it('sets playerInPossession to null if no player is in contact with' +
      ' the ball', () => {
      const playerA = new Player(5, 0, 0, 0, 2); // x, y, vx, vy, diameter
      const playerB = new Player(5, 0, 0, 0, 2); // x, y, vx, vy, diameter

      const service =
        new BallPossessionService(ball, [playerA, playerB], queue);

      service.update();

      expect(service.getCurrentPlayerInPossessionOrNull()).to.be.null;
    });

    it('triggers whenPossessionChanged callbacks if a new player gains ' +
      'possession', () => {
      const playerA = new Player(0, 0, 0, 0, 2); // x, y, vx, vy, diameter
      const playerB = new Player(5, 0, 0, 0, 2); // x, y, vx, vy, diameter

      const service =
        new BallPossessionService(ball, [playerA, playerB], queue);
      const callback = sinon.spy();
      service.whenPossessionChanged((player) => callback.call(this, player));
      service.update();
      [playerA.x, playerA.y] = [5, 0];
      [playerB.x, playerB.y] = [0, 0];

      service.update();

      expect(callback).to.have.been.calledOnceWith(playerB);
    });
  });

  describe('`getLastPlayerInPossession`', () => {
    it('returns the last (non-null) player in possession of the ball', () => {
      const player = new Player(0.5, 0.5, 0, 0, 2); // x, y, vx, vy, diameter
      const service = new BallPossessionService(ball, [player], queue);

      service.update();

      const playerInPossession = service.getLastPlayerInPossession();

      expect(playerInPossession).to.equal(player);
    });
  });
});
