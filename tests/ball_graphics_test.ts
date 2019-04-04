import { assertApproximatelyEqual } from './helpers/custom_assertions';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { BallGraphics } from '../src/ball_graphics';
import { constants, EVENTS } from '../src/constants';
import { EventQueue } from "../src/event_queue";
import { IBallSchema } from '../src/iball_schema';
import { TestAnimationEngine } from "./helpers/test_animation_engine";

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('BallGraphics', () => {
  describe('`animate`', () => {
    it('displays a ball with data received from the queue with default scale',
      () => {
        const engine = new TestAnimationEngine();
        const queue = new EventQueue();
        const drawBallStub = sinon.stub(engine, 'drawBall');
        const graphics = new BallGraphics(engine, queue);

        const ballData = { x: 0.1, y: 0.2, vx: 0.3, vy: 0.4, diameter: 0.5};
        queue.trigger(EVENTS.BALL_DATA, ballData);

        graphics.animate();
        expect(drawBallStub).to.have.been.calledWith(ballData);
      });

      it('draws the ball to the provided scale ([xmin, ymin, xmax, ymax])',
        () => {
          const engine = new TestAnimationEngine();
          const queue = new EventQueue();
          const graphics = new BallGraphics(engine, queue);
          graphics.setScale([1, 2, 3, 5]);
          const ballData = {x: 0.1, y: 0.2, vx: 0.3, vy: 0.4, diameter: 0.5};
          queue.trigger(EVENTS.BALL_DATA, ballData);

          sinon.stub(engine, 'drawBall').callsFake(
            (ballArgument: IBallSchema) => {
              assertApproximatelyEqual(ballArgument.x, 1.2, 0.001);
              assertApproximatelyEqual(ballArgument.y, 2.6, 0.001);
              assertApproximatelyEqual(ballArgument.vx, 0.6, 0.001);
              assertApproximatelyEqual(ballArgument.vy, 1.2, 0.001);
              assertApproximatelyEqual(ballArgument.diameter, 1.5, 0.001);
          });
          graphics.animate();
        });

      it('does not display if no data has been received from the queue',
        () => {
          const engine = new TestAnimationEngine();
          const queue = new EventQueue();
          const graphics = new BallGraphics(engine, queue);
          const drawBallStub = sinon.stub(engine, 'drawBall');

          graphics.animate();
          expect(drawBallStub).not.to.have.been.called;
        });
  });
});
