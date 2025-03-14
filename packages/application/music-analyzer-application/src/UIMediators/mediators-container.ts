import { BeatElements, ChordElements, MelodyElements, MusicStructureElements } from "../piano-roll";
import { ColorChangeMediator } from "./color-change-mediator";
import { ChordGravityMediator, DMelodyMediator, MelodyBeepMediator, ScaleGravityMediator } from "./switcher-mediator";
import { HierarchyLevelMediator, MelodyVolumeMediator, TimeRangeMediator } from "./slider-mediator";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { Controllers } from "../setup-ui/setup-controllers";
import { AnalyzedDataContainer } from "../analyzed-data-container";

export class ApplicationManager {
  readonly music_structure: MusicStructureElements
  readonly controller: Controllers
  readonly audio: AudioReflectableRegistry
  readonly window: WindowReflectableRegistry
  constructor(
    NO_CHORD: boolean,
    analyzed: AnalyzedDataContainer
  ) {
    const { beat_info, romans, hierarchical_melody, d_melodies } = analyzed;
    const last = <T>(arr: T[]) => arr[arr.length - 1];
    const melodies = last(hierarchical_melody);
    this.music_structure = new MusicStructureElements(
      new BeatElements(beat_info, melodies),
      new ChordElements(romans),
      new MelodyElements(hierarchical_melody, d_melodies),
    )

    this.controller = new Controllers(NO_CHORD);
    this.audio = new AudioReflectableRegistry();
    this.window = new WindowReflectableRegistry();

    const e = this.music_structure;
    new DMelodyMediator([this.controller.children.d_melody.checkbox], [e.melody.d_melody_collection]);
    new ScaleGravityMediator([this.controller.children.gravity.scale_checkbox], [e.melody.scale_gravities]);
    new ChordGravityMediator([this.controller.children.gravity.chord_checkbox], [e.melody.chord_gravities]);
    new HierarchyLevelMediator([this.controller.children.hierarchy.slider], [
      e.melody.melody_hierarchy,
      e.melody.ir_hierarchy,
      e.melody.ir_plot,
      e.melody.time_span_tree,
      e.melody.scale_gravities,
      e.melody.chord_gravities
    ]);
    new MelodyBeepMediator([this.controller.children.melody_beep.checkbox], [e.melody.melody_hierarchy]);
    new MelodyVolumeMediator([this.controller.children.melody_beep.volume], [e.melody.melody_hierarchy]);
    new TimeRangeMediator([this.controller.children.time_range.slider], [e.melody.melody_hierarchy], this.audio, this.window);
    new ColorChangeMediator(
      this.controller.children.melody_color.selector.children,
      [
        e.melody.ir_hierarchy,
        e.melody.ir_plot,
        e.melody.melody_hierarchy,
        e.melody.time_span_tree
      ]
    );
  }
}
