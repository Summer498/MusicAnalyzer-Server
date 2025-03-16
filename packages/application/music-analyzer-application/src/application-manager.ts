import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { BeatElements, ChordElements, MelodyElements, MusicStructureElements } from "./piano-roll";
import { AnalyzedDataContainer } from "./containers";
import { MelodyColorController, DMelodyController, GravityController, HierarchyLevelController, MelodyBeepController, TimeRangeController } from "@music-analyzer/controllers";

class Controllers {
  readonly div: HTMLDivElement;
  constructor(
    ...children: { view: HTMLElement }[]
  ) {
    this.div = document.createElement("div");
    this.div.id = "controllers";
    this.div.style = "margin-top:20px";
    children.forEach(e => this.div.appendChild(e.view))
  }
}

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
    this.analyzed = new MusicStructureElements(
      new BeatElements(beat_info, melodies),
      new ChordElements(romans),
      new MelodyElements(hierarchical_melody, d_melodies),
    )

    const layer_count = analyzed.hierarchical_melody.length - 1;
    const length = melodies.length
    const {
      d_melody,
      gravity,
      hierarchy,
      melody_beep,
      melody_color,
      time_range,
    } = {
      d_melody: new DMelodyController(),
      gravity: new GravityController(!this.NO_CHORD),
      hierarchy: new HierarchyLevelController(layer_count),
      melody_beep: new MelodyBeepController(),
      melody_color: new MelodyColorController(),
      time_range: new TimeRangeController(length),
    }

    this.controller = new Controllers(d_melody, hierarchy, time_range, gravity, melody_beep, melody_color);
    this.audio_time_mediator = new AudioReflectableRegistry();
    this.window_size_mediator = new WindowReflectableRegistry();

    const e = this.analyzed;
    d_melody.register(e.melody.d_melody_collection);
    gravity.chord_checkbox.register(e.melody.chord_gravities);
    gravity.scale_checkbox.register(e.melody.scale_gravities);
    hierarchy.register(e.melody.melody_hierarchy, e.melody.ir_hierarchy, e.melody.ir_plot.children[0], e.melody.time_span_tree, e.melody.scale_gravities, e.melody.chord_gravities);
    melody_beep.checkbox.register(...e.melody.melody_hierarchy.children.flatMap(e=>e.children.flatMap(e=>e)));
    melody_beep.volume.register(...e.melody.melody_hierarchy.children.flatMap(e=>e.children.flatMap(e=>e)));
    melody_color.register(e.melody.ir_hierarchy, e.melody.ir_plot.children[0], e.melody.melody_hierarchy, e.melody.time_span_tree)
    time_range.register(this.audio_time_mediator, this.window_size_mediator);
  }
}
