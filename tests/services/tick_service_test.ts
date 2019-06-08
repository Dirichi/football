import { EventQueue } from '../../src/event_queue';
import { TickService } from '../../src/services/tick_service';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('TickService', () => {
  describe('`after`', () => {
    it('triggers the provided callback after the provided number of ticks',
      () => {
        const queue = new EventQueue();
        const service = new TickService(queue);
        const callback = sinon.spy();

        service.after(5, callback);

        for(let i = 0; i < 6; i++) {
          service.tick();
        }

        expect(callback).to.have.been.calledOnce;
      });

    it('does not trigger before the provided number of ticks transpire',
      () => {
        const queue = new EventQueue();
        const service = new TickService(queue);
        const callback = sinon.spy();

        service.after(5, callback);

        for(let i = 0; i < 5; i++) {
          service.tick();
        }

        expect(callback).not.to.have.been.called;
      });
  });
});
