import { Ball } from '../src/ball';
import { ChaseBallCommand } from '../src/chase_ball_command';
import { Player } from '../src/player';
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

      const player = new Player(0, 1, 0, 0, 1, 1); // x, y, vx, vy, speed, diameter
      const moveStub = sinon.stub(player, 'moveTowards');
      command.execute(player);

      expect(moveStub).to.have.been.calledWith(ball.x, ball.y, 0.75);
    });

    it('stops the player if already within the margin', () => {
      const ball = new Ball(0, 0, 0, 0, 0.5); // x, y, vx, vy, diameter
      const command = new ChaseBallCommand(ball);

      const player = new Player(0, 0.7, 0, 0, 1, 1); // x, y, vx, vy, speed, diameter
      const stopStub = sinon.stub(player, 'stop');
      const moveStub = sinon.stub(player, 'moveTowards');
      command.execute(player);

      expect(stopStub).to.have.been.called;
      expect(moveStub).not.to.have.been.called;
    });
  });
});
