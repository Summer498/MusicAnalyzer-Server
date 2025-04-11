import { IHierarchyBuilder } from "../i-hierarchy-builder";
import { Reduction } from "./reduction";
import { ReductionHierarchy } from "./reduction-hierarchy";
import { ReductionLayer } from "./reduction-layer";
import { ReductionModel } from "./reduction-model";
import { ReductionView } from "./reduction-view/reduction-view";

export function buildReduction(this: IHierarchyBuilder) {
  const layer = this.h_melodies.map((e, l) => {
    const parts = e.map(e => {
      const model = new ReductionModel(e, l);
      const view = new ReductionView(model);
      return new Reduction(model, view)
    });
    return new ReductionLayer(parts, l)
  })
  return new ReductionHierarchy(layer, this.controllers);
}
