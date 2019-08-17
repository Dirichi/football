import io from 'socket.io-client';
import p5 from "p5";
import { constants, IO_MESSAGE_TYPE } from "../../constants";
import { BallGraphics } from "../../client/graphics/ball_graphics";
import { BoxGraphics } from "../../client/graphics/box_graphics";
import { EventQueue } from '../../event_queue';
import { FieldGraphics } from "../../client/graphics/field_graphics";
import { FieldRegionGraphics } from "../../client/graphics/field_region_graphics";
import { ManualInputHandler } from "../../client/manual_input_handler";
import { P5AnimationEngine } from "../../client/p5_animation_engine";
import { PlayerGraphics } from "../../client/graphics/player_graphics";
import { PostGraphics } from "../../client/graphics/post_graphics";
import { GameStateTextGraphics } from "../../client/graphics/game_state_text_graphics";
import { ScoresPanelGraphics } from "../../client/graphics/scores_panel_graphics";
import { PositionValueDebugGraphics } from "../../client/graphics/position_value_debug_graphics";
import { SoundPlayer } from "../../client/sound_player";
import { SOUND_ID } from "../../constants";

const socket = io();
const queue = new EventQueue();
const manualInputHandler = new ManualInputHandler(socket);
const kickSoundFile = { id: SOUND_ID.KICK, filePath: "/resources/kick.mp3" };
const soundPlayer = new SoundPlayer([kickSoundFile]);

const sketch = (p: p5) => {
  soundPlayer.load();
  const animationEngine = new P5AnimationEngine(p, soundPlayer);
  const fieldGraphics = new FieldGraphics(animationEngine, queue);
  const postGraphics = new PostGraphics(animationEngine, queue);
  const boxGraphics = new BoxGraphics(animationEngine, queue);
  const ballGraphics = new BallGraphics(animationEngine, queue);
  const playerGraphics = new PlayerGraphics(animationEngine, queue);
  const fieldRegionGraphics = new FieldRegionGraphics(animationEngine, queue);
  const gameStateTextGraphics =
    new GameStateTextGraphics(animationEngine, queue);
  const scoresPanelGraphics = new ScoresPanelGraphics(animationEngine, queue);
  const positionValueDebugGraphics =
    new PositionValueDebugGraphics(animationEngine, queue);

// DO NOT REORDER THIS
// Maybe there should be a way to specify the order in which animations
// should be drawn, other than this list. But that may be over-engineering.
  const graphics = [
    fieldGraphics,
    // TODO: Toggle display of field region graphics with a switch on the client
    // fieldRegionGraphics,
    boxGraphics,
    postGraphics,
    playerGraphics,
    ballGraphics,
    positionValueDebugGraphics,
    gameStateTextGraphics,
    scoresPanelGraphics,
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
    manualInputHandler.sendInput();
    graphics.forEach((graphic) => graphic.animate());
  };
};

// TODO: Socket configuration could be encapsulated in another class
socket.on(IO_MESSAGE_TYPE.GAME_STATE, (data) => {
  Object.keys(data).forEach((event) {
    const payload = data[event];
    queue.trigger(event, payload);
  });
});

document.onkeydown = (event: KeyboardEvent) => {
  manualInputHandler.handleKeyDown(event);
};

document.onkeyup = (event: KeyboardEvent) => {
  manualInputHandler.handleKeyUp(event);
};

const psketch = new p5(sketch);
