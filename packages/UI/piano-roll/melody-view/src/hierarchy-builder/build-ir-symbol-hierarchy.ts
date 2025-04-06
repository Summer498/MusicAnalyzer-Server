import { IRSymbolHierarchy } from "../hierarchy/ir-symbol-hierarchy";
import { IRSymbolLayer } from "../layer/ir-symbol-layer";
import { IHierarchyBuilder } from "./i-hierarchy-builder";

export function buildIRSymbol(this: IHierarchyBuilder) {
  const children = this.h_melodies.map((e, l) => new IRSymbolLayer(e, l));
  return new IRSymbolHierarchy(children, this.controllers);
}
