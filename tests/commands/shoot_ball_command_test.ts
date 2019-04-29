import { Ball } from '../../src/game_objects/ball';
import { Player } from '../../src/game_objects/player';
import { Post } from '../../src/game_objects/post';
import { ShootBallCommand } from '../../src/commands/shoot_ball_command';
import { TestBallPossessionService } from '../helpers/test_ball_possession_service';
import { ThreeDimensionalVector } from '../../src/three_dimensional_vector';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('ShootBallCommand', () => {
  describe('`execute`', () => {
    it('moves the ball towards the player\'s opposition goal post', () => {
      const post = new Post(0, 0, 1, 1);
      const player = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      player.setOpposingGoalPost(post);
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter
      const moveStub = sinon.stub(ball, 'moveTowards').callsFake(
        (actual: ThreeDimensionalVector) => {
          const expected = new ThreeDimensionalVector(0.5, 0.5, 0);
          expect(expected.equals(actual));
        });

      // player in possession
      const service = new TestBallPossessionService(player);
      const command = new ShootBallCommand(ball, service);
      command.execute(player);

      expect(moveStub).to.have.been.called;
    });

    it('does not move the ball if the player is not in possession', () => {
      const post = new Post(0, 0, 1, 1);
      const playerA = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const playerB = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      playerA.setOpposingGoalPost(post);
      playerB.setOpposingGoalPost(post);
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter

      const moveStub = sinon.stub(ball, 'moveTowards');

      // playerB in possession
      const service = new TestBallPossessionService(playerB);
      const command = new ShootBallCommand(ball, service);
      command.execute(playerA);

      expect(moveStub).not.to.have.been.called;
    });

    it('does not move the ball if there is no player in possession', () => {
      const post = new Post(0, 0, 1, 1);
      const player = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      player.setOpposingGoalPost(post);
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter

      const moveStub = sinon.stub(ball, 'moveTowards');

      // null player in possession
      const service = new TestBallPossessionService();
      const command = new ShootBallCommand(ball, service);
      command.execute(player);

      expect(moveStub).not.to.have.been.called;
    });
  });
});
