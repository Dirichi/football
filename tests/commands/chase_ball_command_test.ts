import { Ball } from '../../src/game_objects/ball';
import { ChaseBallCommand } from '../../src/commands/chase_ball_command';
import { Player } from '../../src/game_objects/player';
import { TestBallPossessionService } from '../helpers/test_ball_possession_service';
import { ThreeDimensionalVector } from '../../src/three_dimensional_vector';
import { matchesVector } from '../helpers/custom_assertions';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('ChaseBallCommand', () => {
  describe('`execute`', () => {
    it('moves the player to the ball if the player does not have the ball',
      () => {
        const ball = new Ball(0, 0, 0, 0, 0.5);
        const player = new Player(0, 0, 0, 0, 1);

        const command = new ChaseBallCommand(ball);
        sinon.stub(player, 'hasBall').returns(false);

        sinon.spy(player, 'moveTowards');
        command.execute(player);
        expect(player.moveTowards).to.have.been.calledWith(
          matchesVector(ball.getPosition())
        );
    });

    it('stops the player if already has the ball', () => {
      const ball = new Ball(0, 0, 0, 0, 0.5); // x, y, vx, vy, diameter
      const player = new Player(0, 0, 0, 0, 1); // x, y, vx, vy, diameter

      sinon.stub(player, 'hasBall').returns(true);

      const command = new ChaseBallCommand(ball);

      const stopStub = sinon.stub(player, 'stop');
      const moveStub = sinon.stub(player, 'moveTowards');
      command.execute(player);

      expect(stopStub).to.have.been.called;
      expect(moveStub).not.to.have.been.called;
    });
  });
});
