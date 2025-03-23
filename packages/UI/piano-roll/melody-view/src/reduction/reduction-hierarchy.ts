import { HierarchyLevelController, HierarchyLevelSubscriber, TimeRangeSubscriber } from "@music-analyzer/controllers";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectable, CollectionHierarchy, WindowReflectable } from "@music-analyzer/view";
import { ReductionLayer, RequiredByReductionLayer } from "./reduction-layer";

export interface RequiredByReductionHierarchy
  extends RequiredByReductionLayer {
  readonly hierarchy: HierarchyLevelController
}
export class ReductionHierarchy
  extends CollectionHierarchy<ReductionLayer>
  implements
  HierarchyLevelSubscriber,
  TimeRangeSubscriber,
  AudioReflectable,
  WindowReflectable {
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
    controllers: RequiredByReductionHierarchy
  ) {
    super("time-span-reduction", hierarchical_melodies.map((e, l) => new ReductionLayer(e, l, controllers)));
    controllers.hierarchy.register(this);
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.time_range.register(this);
  }
  onChangedLayer(value: number) {
    const visible_layer = this.children.filter(e => value >= e.layer);
    this.show.forEach(e => e.renewStrong(value));
    visible_layer.forEach(e => e.renewStrong(value));
    this.setShow(visible_layer);
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
