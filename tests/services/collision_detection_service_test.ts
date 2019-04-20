import { CollisionDetectionService } from '../../src/services/collision_detection_service';
import { EventQueue } from '../../src/event_queue';
import { ICircle } from '../../src/interfaces/icircle';
import { Shape } from '../../src/custom_types/shape';
import { ThreeDimensionalVector } from '../../src/three_dimensional_vector';
import { TestCollidable } from "../helpers/test_collidable";
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('CollisionDetectionService', () => {
  describe('`isColliding`', () => {
    it('returns true if two circles are in contact', () => {
      const service = new CollisionDetectionService();
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

      const collidableOne = new TestCollidable('1');
      const collidableTwo = new TestCollidable('2');
      collidableOne.setShapeData(circleOne);
      collidableTwo.setShapeData(circleTwo);

      expect(service.isColliding(collidableOne, collidableTwo)).to.be.true;
    });

    it('returns true if two circles are intersecting', () => {
      const service = new CollisionDetectionService();

      const circleOne = {
        kind: 'circle',
        getCentre: () => new ThreeDimensionalVector(0, 0, 0),
        getDiameter: () => 2,
      } as ICircle;
      const circleTwo = {
        kind: 'circle',
        getCentre: () => new ThreeDimensionalVector(1, 0, 0),
        getDiameter: () => 2,
      } as ICircle;

      const collidableOne = new TestCollidable('1');
      const collidableTwo = new TestCollidable('2');
      collidableOne.setShapeData(circleOne);
      collidableTwo.setShapeData(circleTwo);

      expect(service.isColliding(collidableOne, collidableTwo)).to.be.true;
    });

    it('returns false if two circles are not in contact', () => {
      const service = new CollisionDetectionService();

      const circleOne = {
        kind: 'circle',
        getCentre: () => new ThreeDimensionalVector(0, 0, 0),
        getDiameter: () => 2,
      } as ICircle;
      const circleTwo = {
        kind: 'circle',
        getCentre: () => new ThreeDimensionalVector(3, 0, 0),
        getDiameter: () => 2,
      } as ICircle;

      const collidableOne = new TestCollidable('1');
      const collidableTwo = new TestCollidable('2');
      collidableOne.setShapeData(circleOne);
      collidableTwo.setShapeData(circleTwo);

      expect(service.isColliding(collidableOne, collidableTwo)).to.be.false;
    });
  });
});