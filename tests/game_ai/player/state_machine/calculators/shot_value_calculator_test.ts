import { Ball } from '../../../../../src/game_objects/ball';
import { Field } from '../../../../../src/game_objects/field';
import { InterceptionCalculator } from '../../../../../src/game_ai/player/state_machine/calculators/interception_calculator';
import { Player } from '../../../../../src/game_objects/player';
import { Post } from '../../../../../src/game_objects/post';
import { ShotValueCalculator } from '../../../../../src/game_ai/player/state_machine/calculators/shot_value_calculator';
import { ThreeDimensionalVector } from '../../../../../src/three_dimensional_vector';
import { round } from '../../../../../src/utils/helper_functions';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('ShotValueCalculator', () => {
  describe('`evaluate`', () => {
    it('returns a constant value if the ball can be intercepted', () => {
      const ball = new Ball(0, 0, 0, 0, 5);
      ball.setMaximumSpeed(2);
      const player = new Player(0, 0, 0, 0, 5);
      const post = new Post(0, 0, 0, 0);
      player.setOpposingGoalPost(post);
      const opposition = [new Player(1, 1, 0, 0, 5)];
      const field = new Field(0, 0, 0, 0);
      const interceptionCalculator = new InterceptionCalculator();
      const calculator =
        new ShotValueCalculator(ball, field, interceptionCalculator);

      sinon.stub(player, 'getOpposingFieldPlayers').returns(opposition);
      sinon.stub(interceptionCalculator, 'canAnyIntercept').withArgs(
        opposition, player.getPosition(), post.getMidPoint(), 2).returns(true);

      expect(calculator.evaluate(player)).to.equal(0.2);
    });

    it('returns a scaled value representing proximity to the goal post if the' +
      ' shot can not be intercepted', () => {
        const ball = new Ball(0, 0, 0, 0, 5);
        ball.setMaximumSpeed(2);
        const player = new Player(0, 0, 0, 0, 5);
        const post = new Post(0, 0, 0, 0);
        player.setOpposingGoalPost(post);

        const opposition = [new Player(1, 1, 0, 0, 5)];
        // field xlength = 10; Important for this test
        const field = new Field(0, 0, 10, 0);
        const interceptionCalculator = new InterceptionCalculator();
        const calculator =
          new ShotValueCalculator(ball, field, interceptionCalculator);

        sinon.stub(post, 'distanceTo')
          .withArgs(player.getPosition()).returns(4);
        sinon.stub(player, 'getOpposingFieldPlayers').returns(opposition);
        sinon.stub(interceptionCalculator, 'canAnyIntercept')
          .withArgs(opposition, player.getPosition(), post.getMidPoint(), 2)
          .returns(false);

        // score = (10 - distFromGoal) scaled from (3.33, 10) to (1, 0.2)
        const score = round(calculator.evaluate(player), 2);
        expect(score).to.equal(0.92);
    });

    it('returns a constant maximum value if the player is within a radius ' +
      ' a third of the field\'s length of the post', () => {
        const ball = new Ball(0, 0, 0, 0, 5);
        ball.setMaximumSpeed(2);
        const player = new Player(0, 0, 0, 0, 5);
        const post = new Post(0, 0, 0, 0);
        player.setOpposingGoalPost(post);

        const opposition = [new Player(1, 1, 0, 0, 5)];
        // field xlength = 10; Important for this test
        const field = new Field(0, 0, 10, 0);
        const interceptionCalculator = new InterceptionCalculator();
        const calculator =
          new ShotValueCalculator(ball, field, interceptionCalculator);

        sinon.stub(post, 'distanceTo')
          .withArgs(player.getPosition()).returns(3.33);
        sinon.stub(player, 'getOpposingFieldPlayers').returns(opposition);
        sinon.stub(interceptionCalculator, 'canAnyIntercept')
          .withArgs(opposition, player.getPosition(), post.getMidPoint(), 2)
          .returns(false);

        const score = round(calculator.evaluate(player), 2);
        expect(score).to.equal(1);
    });

    it('does not return values lower than the prescribed minimum', () => {
      const ball = new Ball(0, 0, 0, 0, 5);
      ball.setMaximumSpeed(2);
      const player = new Player(0, 0, 0, 0, 5);
      const post = new Post(0, 0, 0, 0);
      player.setOpposingGoalPost(post);

      const opposition = [new Player(1, 1, 0, 0, 5)];
      // field xlength = 10; Important for this test
      const field = new Field(0, 0, 10, 0);
      const interceptionCalculator = new InterceptionCalculator();
      const calculator =
        new ShotValueCalculator(ball, field, interceptionCalculator);

      sinon.stub(post, 'distanceTo').withArgs(player.getPosition()).returns(12);
      sinon.stub(player, 'getOpposingFieldPlayers').returns(opposition);
      sinon.stub(interceptionCalculator, 'canAnyIntercept')
        .withArgs(opposition, player.getPosition(), post.getMidPoint(), 2)
        .returns(false);

      expect(calculator.evaluate(player)).to.equal(0.2);
    });

    it('overrides player position in the calculation if a startingPosition ' +
      'is provided', () => {
        const ball = new Ball(0, 0, 0, 0, 5);
        ball.setMaximumSpeed(2);
        const player = new Player(0, 0, 0, 0, 5);
        const post = new Post(0, 0, 0, 0);
        player.setOpposingGoalPost(post);

        const opposition = [new Player(1, 1, 0, 0, 5)];
        // field xlength = 10; Important for this test
        const field = new Field(0, 0, 10, 0);
        const interceptionCalculator = new InterceptionCalculator();
        const calculator =
          new ShotValueCalculator(ball, field, interceptionCalculator);
        const startingPosition = new ThreeDimensionalVector(5, 5, 0);

        sinon.stub(post, 'distanceTo').withArgs(startingPosition).returns(4);
        sinon.stub(player, 'getOpposingFieldPlayers').returns(opposition);
        sinon.stub(interceptionCalculator, 'canAnyIntercept')
          .withArgs(opposition, startingPosition, post.getMidPoint(), 2)
          .returns(false);

        // score = (10 - distFromGoal) scaled from (3.33, 10) to (1, 0.2)
        const score = round(calculator.evaluate(player, startingPosition), 2);
        expect(score).to.equal(0.92);
        expect(post.distanceTo).not.to.have.been.calledWith(
          player.getPosition());
    });
  });
});
