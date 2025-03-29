import { HierarchyLevelSubscriber } from "@music-analyzer/controllers/src/slider/hierarchy-level/hierarchy-level-subscriber";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { AudioReflectable } from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { CollectionHierarchy } from "@music-analyzer/view/src/collection-hierarchy";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { ReductionLayer } from "./reduction-layer";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/set-color";
import { RequiredByReductionHierarchy } from "../requirement/reduction/required-by-reduction-hierarchy";

export interface IReductionHierarchy
  extends
  HierarchyLevelSubscriber,
  TimeRangeSubscriber,
  AudioReflectable,
  WindowReflectable { }

export class ReductionHierarchy
  extends CollectionHierarchy<ReductionLayer>
  implements IReductionHierarchy {
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
    controllers: RequiredByReductionHierarchy
  ) {
    super("time-span-reduction", hierarchical_melodies.map((e, l) => new ReductionLayer(e, l)));
    controllers.melody_color.register(this);
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
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
