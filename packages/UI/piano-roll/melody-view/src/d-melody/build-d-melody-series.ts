import { DMelody } from "./d-melody";
import { DMelodySeries } from "./d-melody-series";
import { IHierarchyBuilder } from "../i-hierarchy-builder";

export function buildDMelody(this: IHierarchyBuilder) {
  const children = this.d_melody.map(e => new DMelody(e))
  return new DMelodySeries(children, this.controllers);
}
