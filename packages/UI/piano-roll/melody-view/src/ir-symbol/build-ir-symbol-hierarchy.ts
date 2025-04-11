import { IHierarchyBuilder } from "../i-hierarchy-builder";
import { IRSymbol } from "./ir-symbol";
import { IRSymbolHierarchy } from "./ir-symbol-hierarchy";
import { IRSymbolLayer } from "./ir-symbol-layer";
import { IRSymbolModel } from "./ir-symbol-model";
import { IRSymbolView } from "./ir-symbol-view";

export function buildIRSymbol(this: IHierarchyBuilder) {
  const children = this.h_melodies.map((e, l) => {
    const parts = e.map(e => {
      const model = new IRSymbolModel(e, l);
      const view = new IRSymbolView(model);
      return new IRSymbol(model, view)
    });
    return new IRSymbolLayer(parts, l)
  });
  return new IRSymbolHierarchy(children, this.controllers);
}
