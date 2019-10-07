import { EVENTS, GAME_STATUS, SOUND_ID } from "../../constants";
import { EventQueue } from "../../event_queue";
import { IAnimationEngine } from "../../interfaces/ianimation_engine";
import { ITextSchema } from "../../interfaces/itext_schema";
import { SoundPlayer } from "../sound_player";

export class GameStatusGraphics {
  public engine: IAnimationEngine;
  public queue: EventQueue;

  private state: GAME_STATUS = GAME_STATUS.NONE;
  private previousState: GAME_STATUS = GAME_STATUS.NONE;
  private scale: number[];
  private soundPlayer: SoundPlayer;
  private finalWhistlePlayed: boolean = false;

  constructor(
    engine: IAnimationEngine, queue: EventQueue, soundPlayer: SoundPlayer) {
    this.engine = engine;
    this.queue = queue;
    this.scale = [0, 0, 1, 1]; // default scale
    this.soundPlayer = soundPlayer;
    this.configureListeners();
  }

  public animate(): void {
    this.engine.displayText(this.buildTextSchema());
    if (this.isRestarting()) { this.soundPlayer.play(SOUND_ID.WHISTLE); }
    if (this.isOver() && !this.finalWhistlePlayed) {
      this.soundPlayer.play(SOUND_ID.WHISTLE);
      this.finalWhistlePlayed = true;
    }
  }

  public setScale(scale: number[]): void {
    this.scale = scale;
  }

  private configureListeners(): void {
    this.queue.when(EVENTS.GAME_STATUS, (data) => {
      const deserializedData = data as { status: GAME_STATUS };
      this.previousState = this.state;
      this.state = deserializedData.status;
    });
  }

  private isRestarting(): boolean {
    return !this.isOver() && this.previousState !== this.state
      && this.state !== GAME_STATUS.IN_PLAY;
  }

  private isOver(): boolean {
    return this.state === GAME_STATUS.GAME_OVER;
  }

  private buildTextSchema(): ITextSchema {
    const [xmin, ymin, xmax, ymax] = this.scale;
    const statusToTextMapping = new Map([
      [GAME_STATUS.NONE, ""],
      [GAME_STATUS.IN_PLAY, ""],
      [GAME_STATUS.GOAL, "GOAL"],
      [GAME_STATUS.GAME_OVER, "GAME OVER"],
      [GAME_STATUS.KICKOFF, "KICK OFF"]
    ]);

    return {
      value: statusToTextMapping.get(this.state),
      x: xmin + (xmax - xmin) / 2,
      y: ymin + (ymax - ymin) / 2,
    };
  }
}
