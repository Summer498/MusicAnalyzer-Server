import { AudioReflectableRegistry } from "./facade";
import { WindowReflectableRegistry } from "./facade";
import { MusicStructureElements } from "./facade";
import { BeatInfo } from "./facade";
import { SerializedTimeAndRomanAnalysis } from "./facade";
import { SerializedTimeAndAnalyzedMelody } from "./facade";
import { Controllers } from "./controllers";

export class ApplicationManager {
  readonly NO_CHORD = false;  // コード関連のものを表示しない
  readonly FULL_VIEW = true;  // 横いっぱいに分析結果を表示
  readonly analyzed: MusicStructureElements
  readonly controller: Controllers
  readonly audio_time_mediator: AudioReflectableRegistry
  readonly window_size_mediator: WindowReflectableRegistry
  constructor(
    beat_info: BeatInfo,
    romans: SerializedTimeAndRomanAnalysis[],
    hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
    melodies: SerializedTimeAndAnalyzedMelody[],
    d_melodies: SerializedTimeAndAnalyzedMelody[],
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
