import { Field } from '../../src/game_objects/field';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('Field', () => {
  describe('`containsCircle`', () => {
    it('returns false if (`x` - `diameter`/ 2) < `field.x`', () => {
      const field = new Field(0, 0, 2, 2);
      expect(field.containsCircle(0, 1, 1)).to.equal(false);
    });

    it('returns false if (`x` - `diameter`/ 2) = `field.x`', () => {
      const field = new Field(0, 0, 2, 2);
      expect(field.containsCircle(0.5, 1, 1)).to.equal(false);
    });

    it('returns false if (`x` + `diameter`/ 2) = (`field.x` + `field.xlength`)',
      () => {
        const field = new Field(0, 0, 2, 2);
        expect(field.containsCircle(1.5, 1, 1)).to.equal(false);
      });

    it('returns false if (`x` + `diameter`/ 2) > (`field.x` + `field.xlength`)',
      () => {
        const field = new Field(0, 0, 2, 2);
        expect(field.containsCircle(2, 1, 1)).to.equal(false);
      });

    it('returns true if `x` ± `diameter` / 2 is within the boundary', () => {
      const field = new Field(0, 0, 2, 2);
      expect(field.containsCircle(1, 1, 1)).to.equal(true);
    });

    it('returns false if (`y` - `diameter`/ 2) < `field.y`', () => {
      const field = new Field(0, 0, 2, 2);
      expect(field.containsCircle(1, 0, 1)).to.equal(false);
    });

    it('returns false if (`y` - `diameter`/ 2) = `field.y`', () => {
      const field = new Field(0, 0, 2, 2);
      expect(field.containsCircle(1, 0.5, 1)).to.equal(false);
    });

    it('returns false if (`y` - `diameter`/ 2) = (`field.y` + `field.ylength`)',
      () => {
        const field = new Field(0, 0, 2, 2);
        expect(field.containsCircle(1, 1.5, 1)).to.equal(false);
      });

    it('returns false if (`y` - `diameter`/ 2) > (`field.y` + `field.ylength`)',
      () => {
        const field = new Field(0, 0, 2, 2);
        expect(field.containsCircle(1, 2, 1)).to.equal(false);
      });

    it('returns true if `y` ± `diameter` / 2 is within the boundary', () => {
      const field = new Field(0, 0, 2, 2);
      expect(field.containsCircle(1, 1, 1)).to.equal(true);
    });
  });
});
