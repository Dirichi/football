import p5 from "p5";
import { Ball } from "../../ball";
import { BallGraphics } from "../../ball_graphics";
import { BallPhysics } from "../../ball_physics";
import { Box } from "../../box";
import { EventQueue } from '../../event_queue';
import { Field } from "../../field";
import { FieldGraphics } from "../../field_graphics";
import { HollowBoxGraphics } from "../../hollow_box_graphics";
import { P5AnimationEngine } from "../../p5_animation_engine";
import { Post } from "../../post";
import { PostGraphics } from "../../post_graphics";
import { constants } from "../../constants";

import io from 'socket.io-client';
const socket = io();
const queue = new EventQueue();

const symmetricalBoxesCoordinates =
  (field: Field, xlengthRatio: number, ylengthRatio: number) => {
    const xlength = xlengthRatio * field.xlength;
    const ylength = ylengthRatio * field.ylength;
    const yOffset = (1 - ylengthRatio) / 2;
    const yStart = field.y + (yOffset * field.ylength);
    const xStartA = field.x;
    const xStartB = (field.x + field.xlength) - xlength;

    return [
      [xStartA, yStart, xlength, ylength],
      [xStartB, yStart, xlength, ylength],
    ];
  }

const sketch = (p: p5) => {
  const field = new Field(0, 0, p.windowWidth, p.windowHeight);
  const ballX = field.x + (field.xlength / 2);
  const ballY = field.y + (field.ylength / 2);
  const ballDiameter = field.ylength * constants.BALL_DIAMETER_TO_FIELD_YLENGTH;

  const ball = new Ball(ballX, ballY, constants.BALL_INITIAL_VX,
    constants.BALL_INITIAL_VY, ballDiameter);
  const [postACoordinates, postBCoordinates] =
    symmetricalBoxesCoordinates(field, constants.POST_XLENGTH_TO_FIELD_XLENGTH,
      constants.POST_YLENGTH_TO_FIELD_YLENGTH);

  const postA = new Post(...postACoordinates);
  const postB = new Post(...postBCoordinates);
  const posts = [postA, postB];

  const [box18ACoordinates, box18BCoordinates] =
    symmetricalBoxesCoordinates(field, constants.BOX18_XLENGTH_TO_FIELD_XLENGTH,
      constants.BOX18_YLENGTH_TO_FIELD_YLENGTH);

  const [box6ACoordinates, box6BCoordinates] =
    symmetricalBoxesCoordinates(field, constants.BOX6_XLENGTH_TO_FIELD_XLENGTH,
      constants.BOX6_YLENGTH_TO_FIELD_YLENGTH);

  const box6A = new Box(...box6ACoordinates);
  const box6B = new Box(...box6BCoordinates);
  const box18A = new Box(...box18ACoordinates);
  const box18B = new Box(...box18BCoordinates);
  const boxes = [box18A, box18B, box6A, box6B];

  const animationEngine = new P5AnimationEngine(p);
  const fieldGraphics = new FieldGraphics(animationEngine);
  const postGraphics = new PostGraphics(animationEngine);
  const hollowBoxGraphics = new HollowBoxGraphics(animationEngine);
  const ballGraphics = new BallGraphics(animationEngine, queue);

  const ballPhysics = new BallPhysics(field);

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    fieldGraphics.animate(field);
    boxes.forEach((box) => hollowBoxGraphics.animate(box));
    posts.forEach((post) => postGraphics.animate(post));
    ballGraphics.animate();
    // ballPhysics.update(ball);
  };
};

socket.on('ball.data', (data) => {
  queue.trigger('ball.data', data);
});

const psketch = new p5(sketch);
