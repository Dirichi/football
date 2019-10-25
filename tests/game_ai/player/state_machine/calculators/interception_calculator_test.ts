import { InterceptionCalculator } from '../../../../../src/game_ai/player/state_machine/calculators/interception_calculator';
import { Player } from '../../../../../src/game_objects/player';
import { Vector3D } from '../../../../../src/three_dimensional_vector';
import * as chai from 'chai';

import sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('InterceptionCalculator', () => {
  describe('`canAnyIntercept`', () => {
    it('returns true if any of the passed in players can intercept', () => {
      // TODO: Add a link to a diagram that explains this test
      const interceptingPlayer = new Player(0.6, 0.5, 0, 0, 0.01);
      const nonInterceptingPlayer = new Player(0.6, 1, 0, 0, 0.01);
      const players = [interceptingPlayer, nonInterceptingPlayer];
      players.forEach((player) => player.setMaximumSpeed(0.1));


      const start = new Vector3D(0, 0, 0);
      const target = new Vector3D(1, 0, 0);
      const speed = 0.1;

      const calculator = new InterceptionCalculator();
      const canAnyIntercept =
        calculator.canAnyIntercept(players, start, target, speed);
      expect(canAnyIntercept).to.be.true;
    });

    it('returns false if all the passed in players can not intercept', () => {
      const playerOne = new Player(0.6, 1, 0, 0, 0.01);
      const playerTwo = new Player(0.6, 1, 0, 0, 0.01);
      const players = [playerOne, playerTwo];
      players.forEach((player) => player.setMaximumSpeed(0.1));

      const start = new Vector3D(0, 0, 0);
      const target = new Vector3D(1, 0, 0);
      const speed = 0.1;

      const calculator = new InterceptionCalculator();
      const canAnyIntercept =
        calculator.canAnyIntercept(players, start, target, speed);
      expect(canAnyIntercept).to.be.false;
    });

    it('returns false if all the passed in players are behind the ball', () => {
      const playerOne = new Player(-0.6, 0.5, 0, 0, 0.01);
      const playerTwo = new Player(-0.6, 0.5, 0, 0, 0.01);
      const players = [playerOne, playerTwo];
      players.forEach((player) => player.setMaximumSpeed(0.1));

      const start = new Vector3D(0, 0, 0);
      const target = new Vector3D(1, 0, 0);
      const speed = 0.1;

      const calculator = new InterceptionCalculator();
      const canAnyIntercept =
        calculator.canAnyIntercept(players, start, target, speed);
      expect(canAnyIntercept).to.be.false;
    });

    it('returns false if the players\' distance to the start > the' +
        ' ball\'s distance to the target', () => {
        const player = new Player(1.1, 0.5, 0, 0, 0.01).setMaximumSpeed(0.1);
        const start = new Vector3D(0, 0, 0);
        const target = new Vector3D(1, 0, 0);
        const speed = 0.1;

        const calculator = new InterceptionCalculator();
        const canAnyIntercept =
          calculator.canAnyIntercept([player], start, target, speed);

        expect(canAnyIntercept).to.be.false;
    });
  });
});
