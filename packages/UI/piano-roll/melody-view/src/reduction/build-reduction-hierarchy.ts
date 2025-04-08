import { IHierarchyBuilder } from "../i-hierarchy-builder";
import { ReductionHierarchy } from "./reduction-hierarchy";
import { ReductionLayer } from "./reduction-layer";

export function buildReduction(this: IHierarchyBuilder) {
  const children = this.h_melodies.map((e, l) => new ReductionLayer(e, l))
  return new ReductionHierarchy(children, this.controllers);
}
