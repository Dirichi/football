import { Ball } from '../../src/game_objects/ball';
import { ChaseBallCommand } from '../../src/commands/chase_ball_command';
import { Player } from '../../src/game_objects/player';
import { ThreeDimensionalVector } from '../../src/three_dimensional_vector';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('ChaseBallCommand', () => {
  describe('`execute`', () => {
    it('moves the player closer to the ball if not within a margin', () => {
      const ball = new Ball(0, 0, 0, 0, 0.5); // x, y, vx, vy, diameter
      const command = new ChaseBallCommand(ball);

      const player = new Player(0, 1, 0, 0, 1); // x, y, vx, vy, diameter

      const moveStub = sinon.stub(player, 'moveTowards').callsFake(
        (actual: ThreeDimensionalVector) => {
          const expected = new ThreeDimensionalVector(ball.x, ball.y, 0);
          expect(expected.equals(actual));
        });

      command.execute(player);
      expect(moveStub).to.have.been.called;
    });

    it('stops the player if already within the margin', () => {
      const ball = new Ball(0, 0, 0, 0, 0.5); // x, y, vx, vy, diameter
      const command = new ChaseBallCommand(ball);

      const player = new Player(0, 0.7, 0, 0, 1); // x, y, vx, vy, diameter
      const stopStub = sinon.stub(player, 'stop');
      const moveStub = sinon.stub(player, 'moveTowards');
      command.execute(player);

      expect(stopStub).to.have.been.called;
      expect(moveStub).not.to.have.been.called;
    });
  });
});
