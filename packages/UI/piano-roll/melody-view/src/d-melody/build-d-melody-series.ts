import { DMelody } from "./d-melody";
import { DMelodySeries } from "./d-melody-series";
import { IHierarchyBuilder } from "../i-hierarchy-builder";
import { DMelodyModel } from "./d-melody-model";
import { DMelodyView } from "./d-melody-view";

export function buildDMelody(this: IHierarchyBuilder) {
  const parts = this.d_melody.map(e => {
    const model = new DMelodyModel(e);
    const view = new DMelodyView();
    
    return new DMelody(model, view)
  })
  return new DMelodySeries(parts, this.controllers);
}
