import { SOUND_ID } from "../constants";

interface ISoundFile {
  id: SOUND_ID;
  filePath: string;
  audioElement?: HTMLAudioElement;
}

export class SoundPlayer {
  private files: ISoundFile[];

  constructor(soundFiles: ISoundFile[]) {
    this.files = soundFiles;
    this.files.forEach((file) => file.audioElement = new Audio(file.filePath));
  }

  public load(): void {
    this.files.map((file) => file.audioElement.load());
  }

  public play(id: SOUND_ID): void {
    const fileToPlay = this.files.find((file) => file.id === id);
    if (!fileToPlay) { return; }
    fileToPlay.audioElement.play();
  }
}
