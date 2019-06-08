import { EventQueue } from '../src/event_queue';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('EventQueue', () => {
  describe('`when`', () => {
    it('adds the event and callback to the `events` map', () => {
      const queue = new EventQueue();
      const callback = () => {};

      queue.when('something.happened', callback);
      const registeredCallbacks = queue.events.get('something.happened');
      expect(registeredCallbacks).to.eql([callback]);
    });

    it('appends the callback to the event entry if other callbacks are'
        + ' already registered', () => {
      const events = new Map();
      const previouslyAddedCallBack = () => {};
      events.set('something.happened', [previouslyAddedCallBack]);

      const queue = new EventQueue(events);
      const callback = () => {};
      queue.when('something.happened', callback);

      const registeredCallbacks = queue.events.get('something.happened');
      expect(registeredCallbacks.length).to.equal(2);
      expect(registeredCallbacks).to.eql([previouslyAddedCallBack, callback]);
    });
  });

  describe('`trigger`', () => {
    it('runs all callbacks on the specified event', () => {
      const queue = new EventQueue();
      const callbacks = [sinon.spy(), sinon.spy()];
      callbacks.forEach((cb) => {
        queue.when('something.happened', cb);
      });

      const payload = {data: 1};
      queue.trigger('something.happened', payload);

      callbacks.forEach((cb) => {
        expect(cb).to.have.been.calledOnceWith(payload);
      });
    });

    it('does not run callbacks for untriggered events', () => {
      const queue = new EventQueue();
      const callbacks = [sinon.spy(), sinon.spy()];
      callbacks.forEach((cb) => {
        queue.when('something.happened', cb);
      });

      queue.trigger('something.else.happened', {data: 1});
      callbacks.forEach((cb) => {
        expect(cb).to.not.have.been.called;
      });
    });

    it('does not error out if an unregistered event is triggered', () => {
      const queue = new EventQueue();
      const trigger = () => {
        queue.trigger('something.happened', {data: 1});
      };
      expect(trigger).not.to.throw();
    });
  });

  describe('`once`', () => {
    it('adds the event and callback to the `events` map', () => {
      const queue = new EventQueue();
      const callback = () => {};

      queue.once('something.happened', callback);
      const registeredCallbacks = queue.events.get('something.happened');
      expect(registeredCallbacks).to.eql([callback]);
    });

    it('appends the callback to the event entry if other callbacks are'
        + ' already registered', () => {
      const events = new Map();
      const previouslyAddedCallBack = () => {};
      events.set('something.happened', [previouslyAddedCallBack]);

      const queue = new EventQueue(events);
      const callback = () => {};
      queue.once('something.happened', callback);

      const registeredCallbacks = queue.events.get('something.happened');
      expect(registeredCallbacks.length).to.equal(2);
      expect(registeredCallbacks).to.eql([previouslyAddedCallBack, callback]);
    });

    it('ensures that the event is deleted after is triggered once', () => {
      const queue = new EventQueue();
      const callback = () => {};

      queue.once('something.happened', callback);
      queue.trigger('something.happened', {});
      const registeredCallbacks = queue.events.get('something.happened');
      expect(registeredCallbacks).to.be.undefined;
    });
  });
});
