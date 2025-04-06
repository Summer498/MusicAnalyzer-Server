import { DMelodySeries } from "../layer/d-melody-series";
import { DMelody } from "../part/d-melody";
import { IHierarchyBuilder } from "./i-hierarchy-builder";

export function buildDMelody(this: IHierarchyBuilder) {
  const children = this.d_melody.map(e => new DMelody(e))
  return new DMelodySeries(children, this.controllers);
}
