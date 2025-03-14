import { MusicStructureElements } from "../piano-roll";
import { ColorChangeMediator } from "./color-change-mediator";
import { ChordGravityMediator, DMelodyMediator, MelodyBeepMediator, ScaleGravityMediator } from "./switcher-mediator";
import { HierarchyLevelMediator, MelodyVolumeMediator, TimeRangeMediator } from "./slider-mediator";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { Controllers } from "../setup-ui/setup-controllers";

export const jointModelAndView = (
  NO_CHORD: boolean,
  analyzed_elements: MusicStructureElements,
) => {
  const controller = new Controllers(NO_CHORD);
  const audio_subscriber = new AudioReflectableRegistry();
  const window_subscriber = new WindowReflectableRegistry();

  const e = analyzed_elements;
  new DMelodyMediator([controller.children.d_melody.checkbox], [e.melody.d_melody_collection]);
  new ScaleGravityMediator([controller.children.gravity.scale_checkbox], [e.melody.scale_gravities]);
  new ChordGravityMediator([controller.children.gravity.chord_checkbox], [e.melody.chord_gravities]);
  new HierarchyLevelMediator([controller.children.hierarchy.slider], [
    e.melody.melody_hierarchy,
    e.melody.ir_hierarchy,
    e.melody.ir_plot,
    e.melody.time_span_tree,
    e.melody.scale_gravities,
    e.melody.chord_gravities
  ]);
  new MelodyBeepMediator([controller.children.melody_beep.checkbox], [e.melody.melody_hierarchy]);
  new MelodyVolumeMediator([controller.children.melody_beep.volume], [e.melody.melody_hierarchy]);
  new TimeRangeMediator([controller.children.time_range.slider], [e.melody.melody_hierarchy], audio_subscriber, window_subscriber);
  new ColorChangeMediator(
    controller.children.melody_color.selector.children,
    [
      e.melody.ir_hierarchy,
      e.melody.ir_plot,
      e.melody.melody_hierarchy,
      e.melody.time_span_tree
    ]
  );
  return {
    controller,
    audio: audio_subscriber,
    window: window_subscriber
  } as {
    readonly controller: Controllers,
    readonly audio: AudioReflectableRegistry,
    readonly window: WindowReflectableRegistry
  }
}