import { IHierarchyBuilder } from "../i-hierarchy-builder";
import { MelodyHierarchy } from "./melody-hierarchy";
import { MelodyLayer } from "./melody-layer";

export function buildMelody(this: IHierarchyBuilder) {
  const children = this.h_melodies.map((e, l) => new MelodyLayer(e, l));
  return new MelodyHierarchy(children, this.controllers);
}
