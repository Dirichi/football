import { Ball } from '../../src/game_objects/ball';
import { BallPossessionService } from '../../src/services/ball_possession_service';
import { PassBallCommand } from '../../src/commands/pass_ball_command';
import { ThreeDimensionalVector } from '../../src/three_dimensional_vector';
import { Player } from '../../src/game_objects/player';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('PassBallCommand', () => {
  describe('`execute`', () => {
    it('moves the ball towards the sender\'s nearest teammate', () => {
      const sender = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const receiver = new Player(5, 4, 0, 0, 2); // x, y, vx, vy, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter
      const service = new BallPossessionService(ball, []);

      sinon.stub(service, 'getCurrentPlayerInPossession').returns(sender);
      sinon.stub(sender, 'getNearestTeamMate').returns(receiver);

      // Actual Test
      const moveStub = sinon.stub(ball, 'moveTowards').callsFake(
        (actualTarget: ThreeDimensionalVector) => {
          const expectedTarget = new ThreeDimensionalVector(5, 4, 0);
          expect(expectedTarget.equals(actualTarget));
        });

      const command = new PassBallCommand(ball, service);
      command.execute(sender);

      expect(moveStub).to.have.been.called;
    });

    it('does not move the ball if the sender is not in possession', () => {
      const sender = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter
      const service = new BallPossessionService(ball, []);

      sinon.stub(service, 'getCurrentPlayerInPossession')
        .returns(new Player(1, 1, 0, 0, 2));
      const moveStub = sinon.stub(ball, 'moveTowards');

      const command = new PassBallCommand(ball, service);
      command.execute(sender);

      expect(moveStub).not.to.have.been.called;
    });

    it('does not move the ball if there is no player in possession', () => {
      const sender = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter
      const service = new BallPossessionService(ball, []);

      sinon.stub(service, 'getCurrentPlayerInPossession').returns(null);
      const moveStub = sinon.stub(ball, 'moveTowards');
      const command = new PassBallCommand(ball, service);
      command.execute(sender);

      expect(moveStub).not.to.have.been.called;
    });

    it('does not move the ball if there is no available teammate', () => {
      const sender = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter
      const service = new BallPossessionService(ball, []);

      sinon.stub(service, 'getCurrentPlayerInPossession').returns(sender);
      sinon.stub(sender, 'getNearestTeamMate').returns(null);
      const moveStub = sinon.stub(ball, 'moveTowards');
      const command = new PassBallCommand(ball, service);
      command.execute(sender);

      expect(moveStub).not.to.have.been.called;
    });
  });
});
