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

export const registerMediators = (
  controller_UIs: ControllerUIs,
  beat: BeatElements,
  chord: ChordElements,
  melody: MelodyElements,
  audio_subscriber: AudioReflectableRegistry,
  window_subscriber: WindowReflectableRegistry,
) => {
  const d_melody_switcher_mediator = new DMelodyMediator(controller_UIs.d_melody_controller.checkbox, melody.d_melody_collection);
  const scale_gravity_switcher_mediator = new ScaleGravityMediator(controller_UIs.gravity_controller.scale_checkbox, melody.scale_gravities);
  const chord_gravity_switcher_mediator = new ChordGravityMediator(controller_UIs.gravity_controller.chord_checkbox, melody.chord_gravities);
  const hierarchy_level_slider_mediator = new HierarchyLevelMediator(controller_UIs.hierarchy_controller.slider, melody.melody_hierarchy, melody.ir_hierarchy, melody.ir_plot, melody.time_span_tree, melody.scale_gravities, melody.chord_gravities);
  const melody_beep_switcher_mediator = new MelodyBeepMediator(controller_UIs.melody_beep_controller.checkbox, melody.melody_hierarchy);
  const melody_beep_volume_mediator = new MelodyVolumeMediator(controller_UIs.melody_beep_controller.volume, melody.melody_hierarchy);
  const time_range_slider_mediator = new TimeRangeMediator(controller_UIs.time_range_controller.slider, audio_subscriber, window_subscriber);
};