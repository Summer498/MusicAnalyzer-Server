import { AudioReflectable, WindowReflectable } from "@music-analyzer/view";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BeatBarsSeries } from "@music-analyzer/beat-view";

export class BeatElements
  implements AudioReflectable, WindowReflectable {
  readonly children: (AudioReflectable & WindowReflectable)[];
  readonly beat_bars: BeatBarsSeries;
  constructor(
    beat_info: BeatInfo,
    melodies: TimeAndAnalyzedMelody[],
  ) {
    this.beat_bars = new BeatBarsSeries(
      beat_info,
      melodies
    );
    this.children = [
      this.beat_bars
    ];
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
