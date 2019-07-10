import { PassBallCommand } from '../../src/commands/pass_ball_command';
import { STATE_MACHINE_COMMANDS } from '../../src/constants';
import { Player } from '../../src/game_objects/player';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('PassBallCommand', () => {
  describe('`execute`', () => {
    it('kicks the ball towards the receiver', () => {
      const sender = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const receiver = new Player(5, 4, 0, 0, 2); // x, y, vx, vy, diameter

      // HACK: Stub sendMessage to prevent methods being sent to a non-existent
      // queue
      sinon.stub(sender, 'sendMessage');
      sinon.stub(sender, 'kickBall');

      const command = new PassBallCommand();
      command.execute(sender, receiver);

      expect(sender.kickBall).to.have.been.calledWith(receiver.getPosition());
    });

    it('sends a stop message to the receiver if the ball was kicked', () => {
      const sender = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const receiver = new Player(5, 4, 0, 0, 2); // x, y, vx, vy, diameter

      sinon.stub(sender, 'sendMessage');
      sinon.stub(sender, 'kickBall').returns(true);

      const command = new PassBallCommand();
      command.execute(sender, receiver);

      expect(sender.sendMessage).to.have.been.calledWith(receiver,
        {details: STATE_MACHINE_COMMANDS.WAIT});
    });

    it('does not send stop to the receiver if the ball was not kicked', () => {
      const sender = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      const receiver = new Player(5, 4, 0, 0, 2); // x, y, vx, vy, diameter

      sinon.stub(sender, 'sendMessage');
      sinon.stub(sender, 'kickBall').returns(false);

      const command = new PassBallCommand();
      command.execute(sender, receiver);

      expect(sender.sendMessage).not.to.have.been.called;
    });
  });
});
