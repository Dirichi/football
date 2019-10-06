import { EVENTS, SOUND_ID } from "../../constants";
import { EventQueue } from "../../event_queue";
import { IAnimationEngine } from "../../interfaces/ianimation_engine";
import { ITextSchema } from "../../interfaces/itext_schema";
import { SoundPlayer } from "../sound_player";

export class GameStateTextGraphics {
  public engine: IAnimationEngine;
  public queue: EventQueue;

  private text: ITextSchema;
  private state: string;
  private previousState: string;
  private scale: number[];
  private soundPlayer: SoundPlayer;

  constructor(
    engine: IAnimationEngine, queue: EventQueue, soundPlayer: SoundPlayer) {
    this.engine = engine;
    this.queue = queue;
    this.scale = [0, 0, 1, 1]; // default scale
    this.soundPlayer = soundPlayer;
    this.state = "";
    this.previousState = "";
    this.configureListeners();
  }

  public animate() {
    if (this.text) { this.engine.displayText(this.text); }
    if (this.isRestarting()) { this.soundPlayer.play(SOUND_ID.WHISTLE); }
  }

  public setScale(scale: number[]) {
    this.scale = scale;
  }

  private configureListeners() {
    this.queue.when(EVENTS.GAME_STATE_TEXT_DATA, (data) => {
      const deserializedData = data as ITextSchema;
      this.previousState = this.state;
      this.text = this.toScale(deserializedData);
      this.state = this.text.value;
    });
  }

  private toScale(data: ITextSchema): ITextSchema {
    const [xmin, ymin, xmax, ymax] = this.scale;
    const xrange = xmax - xmin;
    const yrange = ymax - ymin;

    return {
      value: data.value,
      x: (data.x * xrange) + xmin,
      y: (data.y * yrange) + ymin,
    } as ITextSchema;
  }

  private isRestarting(): boolean {
    return this.previousState !== this.state && this.state !== "";
  }
}
