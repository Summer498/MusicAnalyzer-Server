import { HierarchyLevelController } from "@music-analyzer/controllers";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionHierarchy } from "@music-analyzer/view";
import { IRSymbolLayer, RequiredByIRSymbolLayer } from "./ir-symbol-layer";

export interface RequiredByIRSymbolHierarchy
  extends RequiredByIRSymbolLayer {
  readonly hierarchy: HierarchyLevelController
}

export class IRSymbolHierarchy
  extends CollectionHierarchy<IRSymbolLayer> {
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
    controllers: RequiredByIRSymbolHierarchy
  ) {
    super("implication-realization archetype", hierarchical_melodies.map((e, l) => new IRSymbolLayer(e, l,controllers)));
    controllers.hierarchy.register(this);
  }
}
