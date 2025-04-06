import { ReductionHierarchy } from "../hierarchy";
import { ReductionLayer } from "../layer";
import { IHierarchyBuilder } from "./i-hierarchy-builder";

export function buildReduction(this: IHierarchyBuilder) {
  const children = this.h_melodies.map((e, l) => new ReductionLayer(e, l))
  return new ReductionHierarchy(children, this.controllers);
}
