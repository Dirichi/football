import { Ball } from '../../src/game_objects/ball';
import { BallPossessionService } from '../../src/services/ball_possession_service';
import { PassBallCommand } from '../../src/commands/pass_ball_command';
import { Player } from '../../src/game_objects/player';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('PassBallCommand', () => {
  describe('`execute`', () => {
    it('moves the ball towards the receiver\'s position', () => {
      const sender = new Player(1, 1, 0, 0, 1, 2); // x, y, vx, vy, speed, diameter
      const receiver = new Player(5, 4, 0, 0, 1, 2); // x, y, vx, vy, speed, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter
      const service = new BallPossessionService(ball, [sender, receiver]);

      sinon.stub(service, 'getPlayerInPossession').returns(sender);
      const moveStub = sinon.stub(ball, 'moveTowards');
      const command = new PassBallCommand(ball, service, [receiver]);
      command.execute(sender);

      expect(moveStub).to.have.been.calledWith(5, 4);
    });

    it('does not move the ball if the sender is not in possession', () => {
      const sender = new Player(1, 1, 0, 0, 1, 2); // x, y, vx, vy, speed, diameter
      const receiver = new Player(1, 1, 0, 0, 1, 2); // x, y, vx, vy, speed, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter
      const service = new BallPossessionService(ball, [sender, receiver]);

      sinon.stub(service, 'getPlayerInPossession').returns(receiver);
      const moveStub = sinon.stub(ball, 'moveTowards');
      const command = new PassBallCommand(ball, service, [receiver]);
      command.execute(sender);

      expect(moveStub).not.to.have.been.called;
    });

    it('does not move the ball if there is no player in possession', () => {
      const sender = new Player(1, 1, 0, 0, 1, 2); // x, y, vx, vy, speed, diameter
      const receiver = new Player(1, 1, 0, 0, 1, 2); // x, y, vx, vy, speed, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter
      const service = new BallPossessionService(ball, [sender, receiver]);

      sinon.stub(service, 'getPlayerInPossession').returns(null);
      const moveStub = sinon.stub(ball, 'moveTowards');
      const command = new PassBallCommand(ball, service, [receiver]);
      command.execute(sender);

      expect(moveStub).not.to.have.been.called;
    });

    it('does not move the ball if there is no available receiver', () => {
      const sender = new Player(1, 1, 0, 0, 1, 2); // x, y, vx, vy, speed, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter
      const service = new BallPossessionService(ball, [sender]);

      sinon.stub(service, 'getPlayerInPossession').returns(null);
      const moveStub = sinon.stub(ball, 'moveTowards');
      const command = new PassBallCommand(ball, service, []);
      command.execute(sender);

      expect(moveStub).not.to.have.been.called;
    });
  });
});
