import * as chai from 'chai';
import * as sinon from 'sinon';
import { BallGraphics } from '../src/ball_graphics';
import { constants, EVENTS } from '../src/constants';
import { EventQueue } from "../src/event_queue";
import { IAnimationEngine } from "../src/ianimation_engine";

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

class TestAnimationEngine implements IAnimationEngine {
  circle(xcenter: number, ycenter: number, diameter: number) {}
  fill(r: number, g: number, b: number) {}
  push() {}
  pop() {}
}

describe('BallGraphics', () => {
  describe('`animate`', () => {
    it('displays a circle with data received from the queue',
      () => {
        const engine = new TestAnimationEngine();
        const queue = new EventQueue();
        const circleStub = sinon.stub(engine, 'circle');
        const graphics = new BallGraphics(engine, queue);

        const ballData = { x: 0.1, y: 0.2, vx: 0.3, vy: 0.4, diameter: 0.5};
        queue.trigger(EVENTS.BALL_DATA, ballData);

        graphics.animate();
        expect(circleStub).to.have.been.calledWith(0.1, 0.2, 0.5);
      });

      it('does not display if no data has been received from the queue',
        () => {
          const engine = new TestAnimationEngine();
          const queue = new EventQueue();
          const graphics = new BallGraphics(engine, queue);
          const circleStub = sinon.stub(engine, 'circle');

          graphics.animate();
          expect(circleStub).not.to.have.been.called;
        });
  });
});
