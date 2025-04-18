import { GravitySwitcher } from "@music-analyzer/controllers";
import { IHierarchyBuilder } from "../i-hierarchy-builder";
import { GravityModel } from "./gravity-model";
import { PianoRollConverter } from "@music-analyzer/view-parameters";
import { GravityView, LinePos } from "./gravity-view";
import { GravityLayer } from "./gravity-layer";
import { GravityHierarchy } from "./gravity-hierarchy";
import { Gravity } from "./gravity";

export function buildGravity(
  this: IHierarchyBuilder,
  mode: "chord_gravity" | "scale_gravity",
  switcher: GravitySwitcher,
) {
  const converter = new PianoRollConverter()

  const layers = this.h_melodies.map((melodies, l) => {
    const next = melodies.slice(1);
    const gravity = next.map((n, i) => {
      const e = melodies[i]
      const g = e.melody_analysis[mode];
      if (!g) { return }
      
      const model = new GravityModel(e, l, n, g);
      const view = new GravityView();
      const line = new LinePos(
        e.time.begin + e.time.duration / 2,
        n.time.begin,
        isNaN(e.note) ? -99 : (0.5 - converter.convertToCoordinate(converter.transposed(e.note))),
        isNaN(e.note) ? -99 : (0.5 - converter.convertToCoordinate(converter.transposed(g.destination))),
      )
      return new Gravity(model, view, line)
    }).filter(e => e !== undefined)
    return new GravityLayer(l, gravity);
  });
  return new GravityHierarchy(mode, layers, { ...this.controllers, switcher });
}
