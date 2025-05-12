import { BeatInfo } from "@music-analyzer/beat-estimation";
import { Time } from "@music-analyzer/time-and";

export class BeatBarModel {
  readonly time: Time;
  constructor(beat_info: BeatInfo, i: number) {
    this.time = new Time(
      i * 60 / beat_info.tempo,
      (i + 1) * 60 / beat_info.tempo
    );
  }
}
