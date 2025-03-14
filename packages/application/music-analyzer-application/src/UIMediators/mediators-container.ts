import { MusicStructureElements } from "../piano-roll";
import { ColorChangeMediator } from "./color-change-mediator";
import { ChordGravityMediator, DMelodyMediator, MelodyBeepMediator, ScaleGravityMediator } from "./switcher-mediator";
import { HierarchyLevelMediator, MelodyVolumeMediator, TimeRangeMediator } from "./slider-mediator";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { Controllers } from "../setup-ui/setup-controllers";

export class ApplicationManager {
  readonly controller: Controllers
  readonly audio: AudioReflectableRegistry
  readonly window: WindowReflectableRegistry
  constructor(
    NO_CHORD: boolean,
    analyzed_elements: MusicStructureElements,
  ) {
    this.controller = new Controllers(NO_CHORD);
    this.audio = new AudioReflectableRegistry();
    this.window = new WindowReflectableRegistry();

    const e = analyzed_elements;
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
