import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionHierarchy } from "@music-analyzer/view";
import { SetColor } from "@music-analyzer/controllers";
import { ReductionLayer } from "./reduction-layer";
import { RequiredByReductionHierarchy } from "../requirement/reduction/required-by-reduction-hierarchy";
import { IReductionHierarchy } from "../interface/reduction/reduction-hierarchy";

export class ReductionHierarchy
  extends CollectionHierarchy<ReductionLayer>
  implements IReductionHierarchy {
  constructor(
    hierarchical_melodies: SerializedTimeAndAnalyzedMelody[][],
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
