import { ControllerUIs } from "../controller-uis";
import { MusicStructureElements } from "../piano-roll";
import { ColorChangeMediator } from "./color-change-mediator";
import { ChordGravityMediator, DMelodyMediator, MelodyBeepMediator, ScaleGravityMediator } from "./switcher-mediator";
import { HierarchyLevelMediator, MelodyVolumeMediator, TimeRangeMediator } from "./slider-mediator";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";

export const jointModelAndView = (
  controller_UIs: ControllerUIs,
  analyzed_elements: MusicStructureElements,
) => {
  const audio_subscriber = new AudioReflectableRegistry();
  const window_subscriber = new WindowReflectableRegistry();

  const e = analyzed_elements;
  new DMelodyMediator([controller_UIs.d_melody.checkbox], [e.melody.d_melody_collection]);
  new ScaleGravityMediator([controller_UIs.gravity.scale_checkbox], [e.melody.scale_gravities]);
  new ChordGravityMediator([controller_UIs.gravity.chord_checkbox], [e.melody.chord_gravities]);
  new HierarchyLevelMediator([controller_UIs.hierarchy.slider], [
    e.melody.melody_hierarchy,
    e.melody.ir_hierarchy,
    e.melody.ir_plot,
    e.melody.time_span_tree,
    e.melody.scale_gravities,
    e.melody.chord_gravities
  ]);
  new MelodyBeepMediator([controller_UIs.melody_beep.checkbox], [e.melody.melody_hierarchy]);
  new MelodyVolumeMediator([controller_UIs.melody_beep.volume], [e.melody.melody_hierarchy]);
  new TimeRangeMediator([controller_UIs.time_range.slider], [e.melody.melody_hierarchy], audio_subscriber, window_subscriber);
  new ColorChangeMediator(
    controller_UIs.melody_color.selector.children,
    [
      e.melody.ir_hierarchy,
      e.melody.ir_plot,
      e.melody.melody_hierarchy,
      e.melody.time_span_tree
    ]
  );
  return { audio: audio_subscriber, window: window_subscriber } as { readonly audio: AudioReflectableRegistry, readonly window: WindowReflectableRegistry }
}