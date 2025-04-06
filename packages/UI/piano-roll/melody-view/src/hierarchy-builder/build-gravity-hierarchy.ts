import { GravityHierarchy } from "../hierarchy";
import { GravitySwitcher } from "@music-analyzer/controllers";
import { GravityLayer } from "../layer";
import { IHierarchyBuilder } from "./i-hierarchy-builder";

export function buildGravity(
  this: IHierarchyBuilder,
  mode: "chord_gravity" | "scale_gravity",
  switcher: GravitySwitcher,
) {
  const children = this.h_melodies.map((e, l) => new GravityLayer(mode, e, l))
  return new GravityHierarchy(mode, children, { ...this.controllers, switcher });
}
