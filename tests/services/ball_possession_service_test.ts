import { Ball } from '../../src/game_objects/ball';
import { BallPossessionService } from '../../src/services/ball_possession_service';
import { Player } from '../../src/game_objects/player';
import { TestEventQueue } from '../helpers/test_event_queue';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let ball: Ball;
let queue: TestEventQueue;

let triggerBallCollisionEventForPlayer = (player: Player) => {
  queue.trigger(`${ball.getGameObjectId()}.collision`, {
    colliderId: player.getGameObjectId(),
    colliderType: 'player',
    shape: player.getShape(),
  });
};

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
    it('listens for ball collision events', () => {
      sinon.stub(queue, 'when');

      const service = new BallPossessionService(ball, [], queue);
      service.setup();
      expect(queue.when).to.have.been.calledWith(
        `${ball.getGameObjectId()}.collision`);
    });
  });

  describe('`getCurrentPlayerInPossessionOrNull`', () => {
    it('returns the most recent player to collide with the ball', () => {
      const playerA = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const playerB = new Player(5, 0, 0, 0, 2); // x, y, vx, vy, diameter

      const service = new BallPossessionService(
        ball, [playerA, playerB], queue);
      service.setup();

      triggerBallCollisionEventForPlayer(playerA);
      triggerBallCollisionEventForPlayer(playerB);

      const player = service.getCurrentPlayerInPossessionOrNull();
      expect(player).to.equal(playerB);
    });

    it('disregards collisions with unregistered objects', () => {
      const playerA = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const playerB = new Player(5, 0, 0, 0, 2); // x, y, vx, vy, diameter

      // notice that playerB is not registered with ballPossessionService
      const service = new BallPossessionService(ball, [playerA], queue);
      service.setup();

      triggerBallCollisionEventForPlayer(playerA);
      triggerBallCollisionEventForPlayer(playerB);

      const player = service.getCurrentPlayerInPossessionOrNull();
      expect(player).to.equal(playerA);
    });

    it('returns null if there is no player in possession', () => {
      const playerA = new Player(5, 0, 0, 0, 2); // x, y, vx, vy, diameter
      const playerB = new Player(5, 0, 0, 0, 2); // x, y, vx, vy, diameter

      const service = new BallPossessionService(ball, [playerA, playerB], queue);
      service.setup();
      const player = service.getCurrentPlayerInPossessionOrNull();
      expect(player).to.be.null;
    });
  });

  describe('`update`', () => {
    it('sets the currentPlayerInPossession to null', () => {
      const player = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const service = new BallPossessionService(ball, [player], queue);
      service.setup();
      triggerBallCollisionEventForPlayer(player);

      service.update();

      const playerInPossession = service.getCurrentPlayerInPossessionOrNull();
      expect(playerInPossession).to.be.null;
    });
  });

  describe('`getLastPlayerInPossession`', () => {
    it('returns the last (non-null) player in possession of the ball', () => {
      const player = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const service = new BallPossessionService(ball, [player], queue);
      service.setup();
      triggerBallCollisionEventForPlayer(player);

      service.update();

      const playerInPossession = service.getLastPlayerInPossession();
      expect(playerInPossession).to.equal(player);
    });
  });
});
