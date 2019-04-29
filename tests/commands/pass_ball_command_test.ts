import { Ball } from '../../src/game_objects/ball';
import { BallPossessionService } from '../../src/services/ball_possession_service';
import { PassBallCommand } from '../../src/commands/pass_ball_command';
import { STATE_MACHINE_COMMANDS } from '../../src/constants';
import { Player } from '../../src/game_objects/player';
import { TestBallPossessionService } from '../helpers/test_ball_possession_service';
import { ThreeDimensionalVector } from '../../src/three_dimensional_vector';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('PassBallCommand', () => {
  describe('`execute`', () => {
    it('moves the ball towards the specified receiver', () => {
      const sender = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const receiver = new Player(5, 4, 0, 0, 2); // x, y, vx, vy, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter

      // HACK: Stub sendMessage to prevent methods being sent to a non-existent
      // queue
      sinon.stub(sender, 'sendMessage');

      // Actual Test
      const moveStub = sinon.stub(ball, 'moveTowards').callsFake(
        (actualTarget: ThreeDimensionalVector) => {
          const expectedTarget = new ThreeDimensionalVector(5, 4, 0);
          expect(expectedTarget.equals(actualTarget));
        });

      // stub the current player in possession of the ball as the sender
      const service = new TestBallPossessionService(sender);
      const command = new PassBallCommand(ball, service);
      command.execute(sender, receiver);

      expect(moveStub).to.have.been.called;
    });

    it('sends a stop message to the receiver', () => {
      const sender = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const receiver = new Player(5, 4, 0, 0, 2); // x, y, vx, vy, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter

      const sendMessageStub = sinon.stub(sender, 'sendMessage');
      // stub the current player in possession of the ball as the sender
      const service = new TestBallPossessionService(sender);

      const command = new PassBallCommand(ball, service);
      command.execute(sender, receiver);

      expect(sendMessageStub).to.have.been.calledWith(
        receiver, {details: STATE_MACHINE_COMMANDS.WAIT});
    });

    it('does not move the ball if the sender is not in possession', () => {
      const sender = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const receiver = new Player(5, 4, 0, 0, 2); // x, y, vx, vy, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter

      const moveStub = sinon.stub(ball, 'moveTowards');

      // stub the current player in possession of the ball as a random player
      const service = new TestBallPossessionService(new Player(1, 1, 0, 0, 2));
      const command = new PassBallCommand(ball, service);
      command.execute(sender, receiver);

      expect(moveStub).not.to.have.been.called;
    });

    it('does not move the ball if there is no player in possession', () => {
      const sender = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const receiver = new Player(5, 4, 0, 0, 2); // x, y, vx, vy, diameter
      const ball = new Ball(0, 0, 0, 0, 2); // x, y, vx, vy, diameter

      const moveStub = sinon.stub(ball, 'moveTowards');

      // stub the current player in possession of the ball as null
      const service = new TestBallPossessionService(null);
      const command = new PassBallCommand(ball, service);
      command.execute(sender, receiver);

      expect(moveStub).not.to.have.been.called;
    });
  });
});
