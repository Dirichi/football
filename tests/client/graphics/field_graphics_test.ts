import { assertApproximatelyEqual } from '../../helpers/custom_assertions';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { constants, EVENTS } from '../../../src/constants';
import { EventQueue } from "../../../src/event_queue";
import { FieldGraphics } from '../../../src/client/graphics/field_graphics';
import { IBoxSchema } from '../../../src/interfaces/ibox_schema';
import { TestAnimationEngine } from "../../helpers/test_animation_engine";

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('FieldGraphics', () => {
  describe('`animate`', () => {
    it('draws the field to the default scale', () => {
      const engine = new TestAnimationEngine();
      const queue = new EventQueue();
      const drawFieldStub = sinon.stub(engine, 'drawField');
      const graphics = new FieldGraphics(engine, queue);

      const fieldData = {x: 0.1, y: 0.1, xlength: 0.3, ylength: 0.4};
      queue.trigger(EVENTS.FIELD_DATA, fieldData);
      graphics.animate();

      expect(drawFieldStub).to.have.been.calledWith(fieldData);
    });

      it('draws the field to the provided scale ([xmin, ymin, xmax, ymax])',
        () => {
          const engine = new TestAnimationEngine();
          const queue = new EventQueue();
          const graphics = new FieldGraphics(engine, queue);
          graphics.setScale([1, 2, 3, 5]);

          const fieldData = {x: 0.1, y: 0.1, xlength: 0.3, ylength: 0.4};
          queue.trigger(EVENTS.FIELD_DATA, fieldData);

          sinon.stub(engine, 'drawField')
            .callsFake((fieldArgument: IBoxSchema) => {
              assertApproximatelyEqual(fieldArgument.x, 1.2, 0.001);
              assertApproximatelyEqual(fieldArgument.y, 2.3, 0.001);
              assertApproximatelyEqual(fieldArgument.xlength, 0.6, 0.001);
              assertApproximatelyEqual(fieldArgument.ylength, 1.2, 0.001);
          });
          graphics.animate();
        });

      it('does not display if no data has been received from the queue',
        () => {
          const engine = new TestAnimationEngine();
          const queue = new EventQueue();
          const graphics = new FieldGraphics(engine, queue);
          const drawFieldStub = sinon.stub(engine, 'drawField');

          graphics.animate();
          expect(drawFieldStub).not.to.have.been.called;
        });
  });
});
