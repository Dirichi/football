import { ChaseBallCommand } from '../../src/commands/chase_ball_command';
import { Player } from '../../src/game_objects/player';
import { TestBallPossessionService } from '../helpers/test_ball_possession_service';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('ChaseBallCommand', () => {
  describe('`execute`', () => {
    it('calls `chaseBall` on the player',
      () => {
        const player = new Player(0, 0, 0, 0, 1);
        const command = new ChaseBallCommand();

        sinon.stub(player, 'chaseBall');
        command.execute(player);
        expect(player.chaseBall).to.have.been.called;
    });
  });
});
