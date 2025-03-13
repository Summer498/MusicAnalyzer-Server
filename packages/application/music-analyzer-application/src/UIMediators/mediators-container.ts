import { ControllerUIs } from "../controller-uis";
import { MusicStructureElements } from "../piano-roll";
import { ColorChangeMediator } from "./color-change-mediator";
import { ChordGravityMediator, DMelodyMediator, MelodyBeepMediator, ScaleGravityMediator } from "./switcher-mediator";
import { HierarchyLevelMediator, MelodyVolumeMediator, TimeRangeMediator } from "./slider-mediator";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";

export class MediatorsContainer {
  readonly d_melody: DMelodyMediator;
  readonly scale_gravity: ScaleGravityMediator;
  readonly chord_gravity: ChordGravityMediator;
  readonly hierarchy_level: HierarchyLevelMediator;
  readonly melody_beep: MelodyBeepMediator;
  readonly melody_volume: MelodyVolumeMediator;
  readonly time_range: TimeRangeMediator;
  readonly color_change: ColorChangeMediator;

  constructor(
    controller_UIs: ControllerUIs,
    analyzed_elements: MusicStructureElements,
    audio_subscriber: AudioReflectableRegistry,
    window_subscriber: WindowReflectableRegistry,
  ) {
    const e = analyzed_elements;
    this.d_melody = new DMelodyMediator([controller_UIs.d_melody.checkbox], [e.melody.d_melody_collection]);
    this.scale_gravity = new ScaleGravityMediator([controller_UIs.gravity.scale_checkbox], [e.melody.scale_gravities]);
    this.chord_gravity = new ChordGravityMediator([controller_UIs.gravity.chord_checkbox], [e.melody.chord_gravities]);
    this.hierarchy_level = new HierarchyLevelMediator([controller_UIs.hierarchy.slider], [
      e.melody.melody_hierarchy,
      e.melody.ir_hierarchy,
      e.melody.ir_plot,
      e.melody.time_span_tree,
      e.melody.scale_gravities,
      e.melody.chord_gravities
    ]);
    this.melody_beep = new MelodyBeepMediator([controller_UIs.melody_beep.checkbox], [e.melody.melody_hierarchy]);
    this.melody_volume = new MelodyVolumeMediator([controller_UIs.melody_beep.volume], [e.melody.melody_hierarchy]);
    this.time_range = new TimeRangeMediator([controller_UIs.time_range.slider], [e.melody.melody_hierarchy], audio_subscriber, window_subscriber);
    this.color_change = new ColorChangeMediator(
      controller_UIs.melody_color.selector.children,
      [
        e.melody.ir_hierarchy,
        e.melody.ir_plot,
        e.melody.melody_hierarchy,
        e.melody.time_span_tree
      ]
    );
  };
}