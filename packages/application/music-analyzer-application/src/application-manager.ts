import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { BeatElements, ChordElements, MelodyElements, MusicStructureElements } from "./piano-roll";
import { AnalyzedDataContainer } from "./containers";
import { ChordGravityMediator, DMelodyMediator, HierarchyLevelMediator, MelodyBeepMediator, MelodyVolumeMediator, ScaleGravityMediator, TimeRangeMediator } from "./UIMediators";
import { ColorChangeMediator } from "./UIMediators/color-change-mediator";
import { MelodyColorController, DMelodyController, GravityController, HierarchyLevelController, MelodyBeepController, TimeRangeController } from "@music-analyzer/controllers";

class ControllerUIs {
  constructor(
    readonly d_melody: DMelodyController,
    readonly hierarchy: HierarchyLevelController,
    readonly time_range: TimeRangeController,
    readonly gravity: GravityController,
    readonly melody_beep: MelodyBeepController,
    readonly melody_color: MelodyColorController,
  ) {  }
}

class Controllers {
  readonly div: HTMLDivElement;
  readonly children: ControllerUIs;
  constructor(
    NO_CHORD: boolean
  ) {
    const {
      d_melody,
      hierarchy,
      time_range,
      gravity,
      melody_beep,
      melody_color
    } =  new ControllerUIs(
      new DMelodyController(),
      new HierarchyLevelController(),
      new TimeRangeController(),
      new GravityController(),
      new MelodyBeepController(),
      new MelodyColorController(),
    );

    this.children = {
      d_melody,
      hierarchy,
      time_range,
      gravity,
      melody_beep,
      melody_color
    }

    this.div = document.createElement("div");
    this.div.id = "controllers";
    this.div.style = "margin-top:20px";
    this.div.appendChild(d_melody.view);
    this.div.appendChild(hierarchy.view);
    this.div.appendChild(time_range.view);
    if (!NO_CHORD) {
      this.div.appendChild(gravity.view);
    }
    this.div.appendChild(melody_beep.view);
    this.div.appendChild(melody_color.view);  // NOTE: 色選択は未実装なので消しておく
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

    this.controller = new Controllers(this.NO_CHORD);
    this.audio_time_mediator = new AudioReflectableRegistry();
    this.window_size_mediator = new WindowReflectableRegistry();

    const e = this.analyzed;
    new DMelodyMediator([this.controller.children.d_melody.checkbox], [e.melody.d_melody_collection]);
    new ScaleGravityMediator([this.controller.children.gravity.scale_checkbox], [e.melody.scale_gravities]);
    new ChordGravityMediator([this.controller.children.gravity.chord_checkbox], [e.melody.chord_gravities]);
    new HierarchyLevelMediator([this.controller.children.hierarchy.slider], [
      e.melody.melody_hierarchy,
      e.melody.ir_hierarchy,
      e.melody.ir_plot.children[0],
      e.melody.time_span_tree,
      e.melody.scale_gravities,
      e.melody.chord_gravities
    ]);
    new MelodyBeepMediator([this.controller.children.melody_beep.checkbox], [e.melody.melody_hierarchy]);
    new MelodyVolumeMediator([this.controller.children.melody_beep.volume], [e.melody.melody_hierarchy]);
    new TimeRangeMediator([this.controller.children.time_range.slider], [e.melody.melody_hierarchy], this.audio_time_mediator, this.window_size_mediator);
    new ColorChangeMediator(
      this.controller.children.melody_color.selector.children,
      [
        e.melody.ir_hierarchy,
        e.melody.ir_plot.children[0],
        e.melody.melody_hierarchy,
        e.melody.time_span_tree
      ]
    );
  }
}
