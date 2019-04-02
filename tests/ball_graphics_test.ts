import * as chai from 'chai';
import * as sinon from 'sinon';
import { BallGraphics } from '../src/ball_graphics';
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

        const ballData = { x: 1, y: 2, vx: 3, vy: 4, diameter: 5};
        queue.trigger("ball.data", ballData);

        graphics.animate();
        expect(circleStub).to.have.been.calledWith(1, 2, 5);
      });
  });
});
