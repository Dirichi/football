import { Player } from '../../src/game_objects/player';
import { Post } from '../../src/game_objects/post';
import { ShootBallCommand } from '../../src/commands/shoot_ball_command';
import { TestBallPossessionService } from '../helpers/test_ball_possession_service';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('ShootBallCommand', () => {
  describe('`execute`', () => {
    it('commands the player to kick the ball towards the goalpost', () => {
      const post = new Post(0, 0, 1, 1);
      const player = new Player(1, 1, 0, 0, 2); // x, y, vx, vy, diameter
      player.setOpposingGoalPost(post);
      sinon.stub(player, 'kickBall');

      const command = new ShootBallCommand();
      command.execute(player);

      expect(player.kickBall).to.have.been.calledWith(post.getMidPoint());
    });
  });
});
