import { Player } from '../../src/game_objects/player';
import { Team } from '../../src/game_objects/team';
import { BALL_CONTROL_REFRESH_TIME } from "../../src/constants";
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('Player', () => {
  describe('`getNearestTeamMate`', () => {
    it('returns the nearest player', () => {
      const playerA = new Player(0, 0, 3, 3, 5);
      const playerB = new Player(1, 2, 3, 3, 5);
      const playerC = new Player(3, 2, 3, 3, 5);

      const team = new Team([playerA, playerB, playerC]);

      expect(playerA.getNearestTeamMate()).to.equal(playerB);
    });

    it('returns null if there are no teammates', () => {
      const playerA = new Player(0, 0, 3, 3, 5);
      const team = new Team([playerA]);

      expect(playerA.getNearestTeamMate()).to.be.null;
    });
  });

  describe('`temporarilyDisableBallControl`', () => {
    beforeEach(() => {
      this.clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      this.clock.restore();
    });

    it('sets ballControlEnabled to false', () => {
      const player = new Player(0, 0, 0, 0, 5);
      expect(player.ballControlIsDisabled()).to.be.false;
      player.temporarilyDisableBallControl();

      expect(player.ballControlIsDisabled()).to.be.true;
    });

    it('re-enables ball control after a delay', () => {
      const player = new Player(0, 0, 0, 0, 5);
      player.temporarilyDisableBallControl();
      expect(player.ballControlIsDisabled()).to.be.true;

      this.clock.tick(BALL_CONTROL_REFRESH_TIME);
      expect(player.ballControlIsDisabled()).to.be.false;
    });
  });
});
