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
        {id: 0, x: 1, y: 2, xlength: 2, ylength: 1},
        {id: 1, x: 1, y: 3, xlength: 2, ylength: 1},
        {id: 2, x: 1, y: 4, xlength: 2, ylength: 1},
        {id: 3, x: 3, y: 2, xlength: 2, ylength: 1},
        {id: 4, x: 3, y: 3, xlength: 2, ylength: 1},
        {id: 5, x: 3, y: 4, xlength: 2, ylength: 1}
      ];

      expect(representation).to.eql(expectedRepresentation);
    });
  });
});
