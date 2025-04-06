import { IRSymbolHierarchy } from "../hierarchy";
import { IRSymbolLayer } from "../layer";
import { IHierarchyBuilder } from "./i-hierarchy-builder";

export function buildIRSymbol(this: IHierarchyBuilder) {
  const children = this.h_melodies.map((e, l) => new IRSymbolLayer(e, l));
  return new IRSymbolHierarchy(children, this.controllers);
}
