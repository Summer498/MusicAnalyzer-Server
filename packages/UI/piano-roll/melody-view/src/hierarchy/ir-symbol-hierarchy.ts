import { CollectionHierarchy } from "@music-analyzer/view";
import { SetColor } from "@music-analyzer/controllers";
import { IRSymbolLayer } from "../layer/ir-symbol-layer";
import { RequiredByIRSymbolHierarchy } from "../r-hierarchy/required-by-ir-symbol-hierarchy";
import { SerializedTimeAndAnalyzedMelody } from "./serialized-time-and-analyzed-melody";
import { I_IRSymbolHierarchy } from "../i-hierarchy/i-ir-symbol-hierarchy";

export class IRSymbolHierarchy
  extends CollectionHierarchy<IRSymbolLayer>
  implements I_IRSymbolHierarchy {
  constructor(
    hierarchical_melodies: SerializedTimeAndAnalyzedMelody[][],
    controllers: RequiredByIRSymbolHierarchy
  ) {
    super("implication-realization archetype", hierarchical_melodies.map((e, l) => new IRSymbolLayer(e, l)));
    controllers.hierarchy.register(this);
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.time_range.register(this);
    controllers.melody_color.register(this)
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
