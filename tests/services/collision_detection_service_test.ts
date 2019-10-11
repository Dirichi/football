import { CollisionDetectionService } from '../../src/services/collision_detection_service';
import { ICircle } from '../../src/interfaces/icircle';
import { Vector3D } from '../../src/three_dimensional_vector';
import { TestCollidable } from "../helpers/test_collidable";
import * as chai from 'chai';

import sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('CollisionDetectionService', () => {
  describe('`isColliding`', () => {
    it('returns true if two circles are within collision range', () => {
      const circleOne = {
        kind: 'circle',
        getCentre: () => new Vector3D(0, 0, 0),
        getDiameter: () => 2,
      } as ICircle;
      const circleTwo = {
        kind: 'circle',
        getCentre: () => new Vector3D(2.2, 0, 0),
        getDiameter: () => 2,
      } as ICircle;

      const collidableOne = new TestCollidable('1');
      const collidableTwo = new TestCollidable('2');
      collidableOne.setShape(circleOne);
      collidableTwo.setShape(circleTwo);

      const service = new CollisionDetectionService();
      service.setCollisionMarginFactor(1.1);
      expect(service.isColliding(collidableOne, collidableTwo)).to.be.true;
    });

    it('returns true if two circles are intersecting', () => {
      const circleOne = {
        kind: 'circle',
        getCentre: () => new Vector3D(0, 0, 0),
        getDiameter: () => 2,
      } as ICircle;
      const circleTwo = {
        kind: 'circle',
        getCentre: () => new Vector3D(1, 0, 0),
        getDiameter: () => 2,
      } as ICircle;

      const collidableOne = new TestCollidable('1');
      const collidableTwo = new TestCollidable('2');
      collidableOne.setShape(circleOne);
      collidableTwo.setShape(circleTwo);

      const service = new CollisionDetectionService();
      expect(service.isColliding(collidableOne, collidableTwo)).to.be.true;
    });

    it('returns false if two circles are not in contact', () => {
      const service = new CollisionDetectionService();

      const circleOne = {
        kind: 'circle',
        getCentre: () => new Vector3D(0, 0, 0),
        getDiameter: () => 2,
      } as ICircle;
      const circleTwo = {
        kind: 'circle',
        getCentre: () => new Vector3D(3, 0, 0),
        getDiameter: () => 2,
      } as ICircle;

      const collidableOne = new TestCollidable('1');
      const collidableTwo = new TestCollidable('2');
      collidableOne.setShape(circleOne);
      collidableTwo.setShape(circleTwo);

      expect(service.isColliding(collidableOne, collidableTwo)).to.be.false;
    });
  });
});
