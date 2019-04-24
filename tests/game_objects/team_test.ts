import { Ball } from '../../src/game_objects/ball';
import { Player } from '../../src/game_objects/player';
import { Team } from '../../src/game_objects/team';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('Team', () => {
  describe('`nearestPlayerToBall`', () => {
    it('returns the nearest player', () => {
      const playerA = new Player(0, 0, 3, 3, 5);
      const playerB = new Player(1, 2, 3, 3, 5);
      const playerC = new Player(3, 2, 3, 3, 5);
      const ball = new Ball(1, 2, 0, 0, 1);

      const team = new Team([playerA, playerB, playerC]);

      expect(team.nearestPlayerToBall(ball)).to.equal(playerB);
    });

    it('returns null if there are no players', () => {
      const ball = new Ball(1, 2, 0, 0, 1);
      const team = new Team([]);

      expect(team.nearestPlayerToBall(ball)).to.be.null;
    });
  });
});
