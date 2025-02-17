import { SvgCollection } from "@music-analyzer/view";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { BeatBarsGroup } from "@music-analyzer/beat-view";

export class BeatElements {
  readonly beat_bars: SvgCollection;
  constructor(
    beat_info: BeatInfo,
    melodies: IMelodyModel[],
  ){
    this.beat_bars = new BeatBarsGroup(
      beat_info,
      melodies
    );
  }
}
