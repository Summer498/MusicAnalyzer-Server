import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { CollectionHierarchy } from "@music-analyzer/view/src/collection-hierarchy";
import { IRSymbolLayer } from "./ir-symbol-layer";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/set-color";
import { RequiredByIRSymbolHierarchy } from "../requirement/ir-symbol/required-by-ir-symbol-hierarchy";
import { I_IRSymbolHierarchy } from "../interface/ir-symbol/ir-symbol-hierarchy";

export class IRSymbolHierarchy
  extends CollectionHierarchy<IRSymbolLayer>
  implements I_IRSymbolHierarchy {
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
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
