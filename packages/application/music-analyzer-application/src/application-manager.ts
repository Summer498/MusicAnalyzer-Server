import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { MusicStructureElements } from "@music-analyzer/piano-roll";
import { Controllers } from "./controllers";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";

export class ApplicationManager {
  readonly NO_CHORD = false;  // コード関連のものを表示しない
  readonly FULL_VIEW = true;  // 横いっぱいに分析結果を表示
  readonly analyzed: MusicStructureElements
  readonly controller: Controllers
  readonly audio_time_mediator: AudioReflectableRegistry
  readonly window_size_mediator: WindowReflectableRegistry
  constructor(
    beat_info: BeatInfo,
    romans: TimeAndRomanAnalysis[],
    hierarchical_melody: TimeAndAnalyzedMelody[][],
    melodies: TimeAndAnalyzedMelody[],
    d_melodies: TimeAndAnalyzedMelody[],
  ) {
    if (hierarchical_melody.length <= 0) {
      throw new Error(`hierarchical melody length must be more than 0 but it is ${hierarchical_melody.length}`);
    }

    const layer_count = hierarchical_melody.length - 1;
    const length = melodies.length

    this.controller = new Controllers(layer_count, length, !this.NO_CHORD);
    this.audio_time_mediator = new AudioReflectableRegistry();
    this.window_size_mediator = new WindowReflectableRegistry();
    const controllers = {
      ...this.controller,
      audio: this.audio_time_mediator,
      window: this.window_size_mediator,
    }

    this.analyzed = new MusicStructureElements(beat_info, romans, hierarchical_melody, melodies, d_melodies, controllers)

    // time_range.register(this.audio_time_mediator, this.window_size_mediator);
  }
}
