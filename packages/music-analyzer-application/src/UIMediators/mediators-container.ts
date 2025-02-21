import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { ControllerUIs } from "../controller-uis";
import { BeatElements, ChordElements, MelodyElements } from "../piano-roll";
import { ChordGravityMediator } from "./chord-gravity-mediator";
import { DMelodyMediator } from "./d-melody-mediator";
import { HierarchyLevelMediator } from "./hierarchy-level-mediator";
import { MelodyBeepMediator } from "./melody-beep-mediator";
import { MelodyVolumeMediator } from "./melody-volume-mediator";
import { ScaleGravityMediator } from "./scale-gravity-mediator";
import { TimeRangeMediator } from "./time-range-mediator";

export class MediatorsContainer {
  readonly d_melody: DMelodyMediator;
  readonly scale_gravity: ScaleGravityMediator;
  readonly chord_gravity: ChordGravityMediator;
  readonly hierarchy_level: HierarchyLevelMediator;
  readonly melody_beep: MelodyBeepMediator;
  readonly melody_volume: MelodyVolumeMediator;
  readonly time_range: TimeRangeMediator;

  constructor(
    controller_UIs: ControllerUIs,
    beat: BeatElements,
    chord: ChordElements,
    melody: MelodyElements,
    audio_subscriber: AudioReflectableRegistry,
    window_subscriber: WindowReflectableRegistry,
  ) {
    this.d_melody = new DMelodyMediator(controller_UIs.d_melody.checkbox, melody.d_melody_collection);
    this.scale_gravity = new ScaleGravityMediator(controller_UIs.gravity.scale_checkbox, melody.scale_gravities);
    this.chord_gravity = new ChordGravityMediator(controller_UIs.gravity.chord_checkbox, melody.chord_gravities);
    this.hierarchy_level = new HierarchyLevelMediator(controller_UIs.hierarchy.slider, melody.melody_hierarchy, melody.ir_hierarchy, melody.ir_plot, melody.time_span_tree, melody.scale_gravities, melody.chord_gravities);
    this.melody_beep = new MelodyBeepMediator(controller_UIs.melody_beep.checkbox, melody.melody_hierarchy);
    this.melody_volume = new MelodyVolumeMediator(controller_UIs.melody_beep.volume, melody.melody_hierarchy);
    this.time_range = new TimeRangeMediator(controller_UIs.time_range.slider, audio_subscriber, window_subscriber);
  };
}