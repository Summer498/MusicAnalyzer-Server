import { BeatInfo } from "@music-analyzer/beat-estimation";

export class BeatBarModel {
  readonly begin: number;
  readonly end: number;
  constructor(beat_info: BeatInfo, i: number) {
    this.begin = i * 60 / beat_info.tempo;
    this.end = (i + 1) * 60 / beat_info.tempo;
  }
}
