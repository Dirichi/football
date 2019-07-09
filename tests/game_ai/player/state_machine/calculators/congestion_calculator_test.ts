import { CongestionCalculator } from '../../../../../src/game_ai/player/state_machine/calculators/congestion_calculator';
import { Player } from '../../../../../src/game_objects/player';
import { ThreeDimensionalVector } from '../../../../../src/three_dimensional_vector';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('CongestionCalculator', () => {
  describe('`evaluate`', () => {
    it('returns a scaled sum of distances from players within the ' +
      '`radiusOfInterest`', () => {
        const playerA = new Player(2, 1.5, 0, 0, 5);
        const playerB = new Player(1.5, 2, 0, 0, 5);
        const playerC = new Player(0, 0, 0, 0, 5);
        const players = [playerA, playerB, playerC];
        const radiusOfInterest = 1;
        const calculator = new CongestionCalculator(players, radiusOfInterest);
        const positionToEvaluate = new ThreeDimensionalVector(2, 2, 0);

        expect(calculator.evaluate(positionToEvaluate)).to.equal(1);
    });
  });
});
