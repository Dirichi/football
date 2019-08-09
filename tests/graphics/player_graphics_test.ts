import { assertApproximatelyEqual } from '../helpers/custom_assertions';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { PlayerGraphics } from '../../src/graphics/player_graphics';
import { constants, EVENTS } from '../../src/constants';
import { EventQueue } from "../../src/event_queue";
import { IPlayerSchema } from '../../src/interfaces/iplayer_schema';
import { TestAnimationEngine } from "../helpers/test_animation_engine";

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('PlayerGraphics', () => {
  describe('`animate`', () => {
    it('displays a players with data received from the queue with default scale',
      () => {
        const engine = new TestAnimationEngine();
        const queue = new EventQueue();
        const drawPlayerStub = sinon.stub(engine, 'drawPlayer');
        const graphics = new PlayerGraphics(engine, queue);

        const playerData = {
          x: 0.1,
          y: 0.2,
          vx: 0.3,
          vy: 0.4,
          diameter: 0.5,
          colors: [200, 0, 0],
          cursor: {
            x: 0.1,
            y: 0.1,
            colors: [200, 0, 0],
            diameter: 0.5,
          }
        };
        queue.trigger(EVENTS.PLAYER_DATA, [playerData]);

        graphics.animate();
        expect(drawPlayerStub).to.have.been.calledWith(playerData);
      });

      it('draws the players to the provided scale ([xmin, ymin, xmax, ymax])',
        () => {
          const engine = new TestAnimationEngine();
          const queue = new EventQueue();
          const graphics = new PlayerGraphics(engine, queue);
          graphics.setScale([1, 2, 3, 5]);
          const playerData = {
            x: 0.1,
            y: 0.2,
            vx: 0.3,
            vy: 0.4,
            diameter: 0.5,
            colors: [200, 0, 0],
            cursor: {
              x: 0.3,
              y: 0.1,
              colors: [200, 200, 0],
              diameter: 0.5,
            }
          };
          queue.trigger(EVENTS.PLAYER_DATA, [playerData]);

          sinon.stub(engine, 'drawPlayer').callsFake(
            (playerArgument: IPlayerSchema) => {
              assertApproximatelyEqual(playerArgument.x, 1.2, 0.001);
              assertApproximatelyEqual(playerArgument.y, 2.6, 0.001);
              assertApproximatelyEqual(playerArgument.vx, 0.6, 0.001);
              assertApproximatelyEqual(playerArgument.vy, 1.2, 0.001);
              assertApproximatelyEqual(playerArgument.diameter, 1.5, 0.001);
              assertApproximatelyEqual(playerArgument.cursor.x, 1.6, 0.001);
              assertApproximatelyEqual(playerArgument.cursor.y, 2.3, 0.001);
              assertApproximatelyEqual(
                  playerArgument.cursor.diameter, 1.5, 0.001);
              expect(playerArgument.colors).to.eql([200, 0, 0]);
              expect(playerArgument.cursor.colors).to.eql([200, 200, 0]);
          });
          graphics.animate();
        });

      it('does not display if no data has been received from the queue',
        () => {
          const engine = new TestAnimationEngine();
          const queue = new EventQueue();
          const graphics = new PlayerGraphics(engine, queue);
          const drawPlayerStub = sinon.stub(engine, 'drawPlayer');

          graphics.animate();
          expect(drawPlayerStub).not.to.have.been.called;
        });
  });
});
