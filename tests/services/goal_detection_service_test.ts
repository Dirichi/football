import { Ball } from '../../src/game_objects/ball';
import { Post } from '../../src/game_objects/post';
import { GoalDetectionService } from '../../src/services/goal_detection_service';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('GoalDetectionService', () => {
  describe('`goalDetected`', () => {
    it('returns true when a ball is in a post', () => {
      const ball = new Ball(1, 1, 0, 0, 1); //x, y, vx, vy, diameter
      const postA = new Post(0, 0, 2, 2); //x, y, xlength, ylength
      const postB = new Post(4, 4, 2, 2); //x, y, xlength, ylength
      const service = new GoalDetectionService(ball, [postA, postB]);

      service.update();
      expect(service.goalDetected()).to.be.true;
    });

    it('does not report multiple goals for a single goal event', () => {
      const ball = new Ball(1, 1, 0, 0, 1); //x, y, vx, vy, diameter
      const postA = new Post(0, 0, 2, 2); //x, y, xlength, ylength
      const postB = new Post(4, 4, 2, 2); //x, y, xlength, ylength
      const service = new GoalDetectionService(ball, [postA, postB]);

      service.update();
      expect(service.goalDetected()).to.be.true;
      service.update();
      expect(service.goalDetected()).to.be.false;
    });
  });

  describe('`getPostContainingBall`', () => {
    it('returns the post containing ball', () => {
      const ball = new Ball(1, 1, 0, 0, 1); //x, y, vx, vy, diameter
      const postA = new Post(0, 0, 2, 2); //x, y, xlength, ylength
      const postB = new Post(4, 4, 2, 2); //x, y, xlength, ylength
      const service = new GoalDetectionService(ball, [postA, postB]);

      service.update();
      expect(service.getPostContainingBall()).to.eql(postA);
    });

    it('returns null if no post contains the ball', () => {
      const ball = new Ball(1, 1, 0, 0, 1); //x, y, vx, vy, diameter
      const postA = new Post(0, 0, 2, 2); //x, y, xlength, ylength
      const postB = new Post(4, 4, 2, 2); //x, y, xlength, ylength
      const service = new GoalDetectionService(ball, [postA, postB]);

      service.update();
      expect(service.getPostContainingBall()).to.eql(postA);
    });

    it('returns null if no post contains the ball', () => {
      const ball = new Ball(-1, -1, 0, 0, 1); //x, y, vx, vy, diameter
      const postA = new Post(0, 0, 2, 2); //x, y, xlength, ylength
      const postB = new Post(4, 4, 2, 2); //x, y, xlength, ylength
      const service = new GoalDetectionService(ball, [postA, postB]);

      service.update();
      expect(service.getPostContainingBall()).to.be.null;
    });
  });
});
