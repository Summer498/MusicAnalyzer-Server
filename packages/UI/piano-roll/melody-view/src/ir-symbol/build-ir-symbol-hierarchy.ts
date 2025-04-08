import { IHierarchyBuilder } from "../i-hierarchy-builder";
import { IRSymbolHierarchy } from "./ir-symbol-hierarchy";
import { IRSymbolLayer } from "./ir-symbol-layer";

export function buildIRSymbol(this: IHierarchyBuilder) {
  const children = this.h_melodies.map((e, l) => new IRSymbolLayer(e, l));
  return new IRSymbolHierarchy(children, this.controllers);
}
