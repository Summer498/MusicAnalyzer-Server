import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { AnalyzedDataContainer } from "./containers";
import { BeatElements, ChordElements, MelodyElements, MusicStructureElements } from "./piano-roll";
import { Controllers } from "./controllers";

export class ApplicationManager {
  readonly NO_CHORD = false;  // コード関連のものを表示しない
  readonly FULL_VIEW = true;  // 横いっぱいに分析結果を表示
  readonly analyzed: MusicStructureElements
  readonly controller: Controllers
  readonly audio_time_mediator: AudioReflectableRegistry
  readonly window_size_mediator: WindowReflectableRegistry
  constructor(
    analyzed: AnalyzedDataContainer
  ) {
    if (analyzed.hierarchical_melody.length <= 0) {
      throw new Error(`hierarchical melody length must be more than 0 but it is ${analyzed.hierarchical_melody.length}`);
    }

    const { beat_info, romans, hierarchical_melody, d_melodies } = analyzed;
    const last = <T>(arr: T[]) => arr[arr.length - 1];
    const melodies = last(hierarchical_melody);

    const layer_count = analyzed.hierarchical_melody.length - 1;
    const length = melodies.length

    this.controller = new Controllers(layer_count, length, !this.NO_CHORD);
    const { time_range } = this.controller;
    this.audio_time_mediator = new AudioReflectableRegistry();
    this.window_size_mediator = new WindowReflectableRegistry();
    const registries = [this.audio_time_mediator, this.window_size_mediator] as [AudioReflectableRegistry, WindowReflectableRegistry];

    this.analyzed = new MusicStructureElements(
      new BeatElements(beat_info, melodies, registries),
      new ChordElements(romans, registries),
      new MelodyElements(hierarchical_melody, d_melodies, this.controller, registries),
    )

//    time_range.register(this.audio_time_mediator, this.window_size_mediator);
  }
}
