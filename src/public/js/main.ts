import io from 'socket.io-client';
import p5 from "p5";
import { constants, EVENTS } from "../../constants";
import { BallGraphics } from "../../ball_graphics";
import { EventQueue } from '../../event_queue';
import { FieldGraphics } from "../../field_graphics";
import { HollowBoxGraphics } from "../../hollow_box_graphics";
import { P5AnimationEngine } from "../../p5_animation_engine";
import { PlayerGraphics } from "../../player_graphics";
import { PostGraphics } from "../../post_graphics";

const socket = io();
const queue = new EventQueue();

const sketch = (p: p5) => {
  const animationEngine = new P5AnimationEngine(p);
  const fieldGraphics = new FieldGraphics(animationEngine, queue);
  const postGraphics = new PostGraphics(animationEngine, queue);
  const hollowBoxGraphics = new HollowBoxGraphics(animationEngine, queue);
  const ballGraphics = new BallGraphics(animationEngine, queue);
  const playerGraphics = new PlayerGraphics(animationEngine, queue);

  const graphics = [
    fieldGraphics,
    hollowBoxGraphics,
    postGraphics,
    playerGraphics,
    ballGraphics,
  ];

  const fieldCoordinates = [];

  p.setup = () => {
    // TODO: These calls to p5 should be hidden inside the p5AnimationEngine or
    // somewhere else so that the GameClient is animation library agnostic
    p.createCanvas(p.windowWidth, p.windowHeight);
    const fieldCoordinates = [0, 0, p.windowWidth, p.windowHeight];
    graphics.forEach((graphic) => graphic.setScale(fieldCoordinates));
  };

  p.draw = () => {
    graphics.forEach((graphic) => graphic.animate());
  };
};

// TODO: Socket configuration could be encapsulated in another class
socket.on(EVENTS.STATE_CHANGED, (data) => {
  Object.keys(data).forEach((event) {
    const payload = data[event];
    queue.trigger(event, payload);
  });
});

const psketch = new p5(sketch);
