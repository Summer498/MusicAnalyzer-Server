import { IHierarchyBuilder } from "../i-hierarchy-builder";
import { Melody } from "./melody";
import { MelodyHierarchy } from "./melody-hierarchy";
import { MelodyLayer } from "./melody-layer";
import { MelodyModel } from "./melody-model";
import { MelodyView } from "./melody-view";

export function buildMelody(this: IHierarchyBuilder) {
  const layers = this.h_melodies.map((e, l) => {
    const parts = e.map(e => {
      const model = new MelodyModel(e);
      const view = new MelodyView();
      return new Melody(model, view)
    })
    return new MelodyLayer(parts, l)
  });
  return new MelodyHierarchy(layers, this.controllers);
}
