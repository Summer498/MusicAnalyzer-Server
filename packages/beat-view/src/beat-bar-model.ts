import { BeatInfo } from "@music-analyzer/beat-estimation";
import { MVCModel } from "@music-analyzer/view";

export class BeatBarModel extends MVCModel {
  readonly begin: number;
  readonly end: number;
  constructor(beat_info: BeatInfo, i: number) {
    super();
    this.begin = i * 60 / beat_info.tempo;
    this.end = (i + 1) * 60 / beat_info.tempo;
  }
}
