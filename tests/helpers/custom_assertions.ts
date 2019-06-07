import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

export function assertApproximatelyEqual(x: number, y: number, margin: number) {
  const error = Math.abs(x - y);
  expect(error < margin).to.be.true;
}
