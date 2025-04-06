import { MelodyHierarchy } from "../hierarchy";
import { MelodyLayer } from "../layer";
import { IHierarchyBuilder } from "./i-hierarchy-builder";

export function buildMelody(this: IHierarchyBuilder) {
  const children = this.h_melodies.map((e, l) => new MelodyLayer(e, l));
  return new MelodyHierarchy(children, this.controllers);
}
