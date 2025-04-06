import { MelodyHierarchy } from "../hierarchy/melody-hierarchy";
import { MelodyLayer } from "../layer/melody-layer";
import { IHierarchyBuilder } from "./i-hierarchy-builder";

export function buildMelody(this: IHierarchyBuilder) {
  const children = this.h_melodies.map((e, l) => new MelodyLayer(e, l));
  return new MelodyHierarchy(children, this.controllers);
}
