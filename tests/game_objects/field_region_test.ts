import { FieldRegion } from '../../src/game_objects/field_region';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('FieldRegion', () => {
  describe('`.generate`', () => {
    it('generates evenly spaced non-overlapping rectangular regions', () => {
      const fieldSchema = { x: 1, y: 2, xlength: 4, ylength: 3 };
      const regions = FieldRegion.generate(fieldSchema, 2, 3);
      const representation = regions.map((region) => region.serialized());
      const expectedRepresentation = [
        {x: 1, y: 2, xlength: 2, ylength: 1},
        {x: 1, y: 3, xlength: 2, ylength: 1},
        {x: 1, y: 4, xlength: 2, ylength: 1},
        {x: 3, y: 2, xlength: 2, ylength: 1},
        {x: 3, y: 3, xlength: 2, ylength: 1},
        {x: 3, y: 4, xlength: 2, ylength: 1}
      ];

      console.log(representation);

      expect(representation).to.eql(expectedRepresentation);
    });
  });
});
