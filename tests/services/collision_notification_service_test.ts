import { CollisionNotificationService } from '../../src/services/collision_notification_service';
import { CollisionDetectionService } from '../../src/services/collision_detection_service';
import { ICircle } from '../../src/interfaces/icircle';
import { EventQueue } from '../../src/event_queue';
import { ThreeDimensionalVector } from '../../src/three_dimensional_vector';
import { TestCollidable } from "../helpers/test_collidable";
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('CollisionNotificationService', () => {
  describe('`registerCollisionGroup`', () => {
    it('stores the collisionGroup', () => {
      const queue = new EventQueue();
      const detectionService = new CollisionDetectionService();
      const notificationService =
        new CollisionNotificationService(detectionService, queue);

      const collidableA = new TestCollidable('1');
      const collidableB = new TestCollidable('2');
      const collidableC = new TestCollidable('3');

      notificationService.registerCollisionGroup([collidableA, collidableB]);
      notificationService.registerCollisionGroup([collidableA, collidableC]);
      const collisionGroups = notificationService.getCollisionGroups();

      const expectedGroups = [
        [collidableA, collidableB],
        [collidableA, collidableC]
      ];

      expect(collisionGroups).to.eql(expectedGroups);
    });
  });

  describe('update', () => {
    it('sends a message for each individual colliding collidable of a collision', () => {
      const queue = new EventQueue();
      const detectionService = new CollisionDetectionService();
      const notificationService =
        new CollisionNotificationService(detectionService, queue);

        const circleOne = {
          kind: 'circle',
          getCentre: () => new ThreeDimensionalVector(0, 0, 0),
          getDiameter: () => 2,
        } as ICircle;

        const circleTwo = {
          kind: 'circle',
          getCentre: () => new ThreeDimensionalVector(2, 0, 0),
          getDiameter: () => 2,
        } as ICircle;

        const circleThree = {
          kind: 'circle',
          getCentre: () => new ThreeDimensionalVector(4, 0, 0),
          getDiameter: () => 2,
        } as ICircle;

      const collidableA = new TestCollidable('collider.1');
      const collidableB = new TestCollidable('collider.2');
      const collidableC = new TestCollidable('collider.3');

      collidableA.setShape(circleOne);
      collidableB.setShape(circleTwo);
      collidableC.setShape(circleThree);

      const isCollidingStub = sinon.stub(detectionService, 'isColliding');
      isCollidingStub.withArgs(collidableA, collidableB).returns(true);
      isCollidingStub.withArgs(collidableA, collidableC).returns(false);

      // Consider creating a test class for the eventQueue that behaves the
      // way this stub is described. Will need to implement an interface
      const eventMessageMap = new Map<string, object[]>();
      sinon.stub(queue, 'trigger').callsFake((event: string, payload: object) => {
        const eventMessages = eventMessageMap.get(event) || [];
        eventMessages.push(payload);
        eventMessageMap.set(event, eventMessages);
      });

      notificationService.registerCollisionGroup([collidableA, collidableB]);
      notificationService.registerCollisionGroup([collidableA, collidableC]);
      notificationService.update();

      expect(eventMessageMap.get('collider.1.collision')).to.eql([
        {colliderType: 'testcollidable', shape: circleTwo},
      ]);
      expect(eventMessageMap.get('collider.2.collision')).to.eql([
        {colliderType: 'testcollidable', shape: circleOne},
      ]);
      expect(eventMessageMap.get('collider.3.collision')).to.be.undefined;
    });
  });
});
