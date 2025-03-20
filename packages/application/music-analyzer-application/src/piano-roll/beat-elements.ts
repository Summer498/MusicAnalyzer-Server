import { AudioReflectable, AudioReflectableRegistry, WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BeatBarsSeries } from "@music-analyzer/beat-view";

export class BeatElements {
  readonly children: (AudioReflectable & WindowReflectable)[];
  readonly beat_bars: BeatBarsSeries;
  constructor(
    beat_info: BeatInfo,
    melodies: TimeAndAnalyzedMelody[],
    publisher: [AudioReflectableRegistry, WindowReflectableRegistry]
  ) {
    this.beat_bars = new BeatBarsSeries(beat_info, melodies, publisher);
    this.children = [this.beat_bars];
  }
}
