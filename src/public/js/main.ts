import p5 from "p5";
import { BallGraphics } from "../../ball_graphics";
import { EventQueue } from '../../event_queue';
import { FieldGraphics } from "../../field_graphics";
import { HollowBoxGraphics } from "../../hollow_box_graphics";
import { P5AnimationEngine } from "../../p5_animation_engine";
import { PostGraphics } from "../../post_graphics";
import { constants } from "../../constants";

import io from 'socket.io-client';
const socket = io();
const queue = new EventQueue();

const sketch = (p: p5) => {
  const animationEngine = new P5AnimationEngine(p);
  const fieldGraphics = new FieldGraphics(animationEngine, queue);
  // const postGraphics = new PostGraphics(animationEngine, queue);
  // const hollowBoxGraphics = new HollowBoxGraphics(animationEngine, queue);
  const ballGraphics = new BallGraphics(animationEngine, queue);
  // const graphics =
  //   [fieldGraphics, hollowBoxGraphics, postGraphics, ballGraphics];
    const graphics =
      [fieldGraphics, ballGraphics];

  const fieldCoordinates = [];

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    const fieldCoordinates = [0, 0, p.windowWidth, p.windowHeight];
    graphics.forEach((graphic) => graphic.setScale(fieldCoordinates))
  };

  p.draw = () => {
    graphics.forEach((graphic) => graphic.animate());
  };
};

socket.on(constants.STATE_CHANGED_EVENT, (data) => {
  Object.keys(data).forEach((event) {
    const payload = data[event];
    queue.trigger(event, payload);
  });
});

const psketch = new p5(sketch);
