import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { DMelodyController, GravityController, HierarchyLevelController, MelodyBeepController, MelodyColorController, TimeRangeController } from "@music-analyzer/controllers";

import { buildDMelody } from "./src/d-melody-series";
import { buildIRPlot } from "./src/ir-plot-svg";
import { buildIRSymbol } from "./src/ir-symbol-hierarchy";
import { buildMelody } from "./src/melody-hierarchy";
import { buildReduction } from "./src/reduction-hierarchy";
import { buildGravity } from "./src/gravity-hierarchy";
import { buildIRGravity } from "./src/ir-gravity-hierarchy";
import { ImplicationDisplayController } from "@music-analyzer/controllers/src/switcher";

export { buildDMelody } from "./src/d-melody-series";
export { buildIRPlot } from "./src/ir-plot-svg";
export { buildIRSymbol } from "./src/ir-symbol-hierarchy";
export { buildMelody } from "./src/melody-hierarchy";
export { buildReduction } from "./src/reduction-hierarchy";
export { buildGravity } from "./src/gravity-hierarchy";
export { buildIRGravity } from "./src/ir-gravity-hierarchy";

export interface RequiredByMelodyElements {
  readonly gravity: GravityController
  readonly audio: AudioReflectableRegistry,
  readonly d_melody: DMelodyController,
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController
  readonly implication : ImplicationDisplayController

  readonly melody_beep: MelodyBeepController
  readonly melody_color: MelodyColorController
  readonly hierarchy: HierarchyLevelController,
}

export interface MelodyElements {
  readonly children: SVGGElement[];
  readonly d_melody_collection: SVGGElement;
  readonly melody_hierarchy: SVGGElement;
  readonly ir_hierarchy: SVGGElement;
  readonly ir_plot_svg: SVGSVGElement;
  readonly ir_gravity: SVGGElement;
  readonly chord_gravities: SVGGElement;
  readonly scale_gravities: SVGGElement;
  readonly time_span_tree: SVGGElement;
}

export function createMelodyElements(
  hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
  d_melodies: SerializedTimeAndAnalyzedMelody[],
  controllers: {
    readonly gravity: GravityController,
    readonly audio: AudioReflectableRegistry,
    readonly d_melody: DMelodyController,
    readonly window: WindowReflectableRegistry,
    readonly time_range: TimeRangeController,
    readonly implication : ImplicationDisplayController,
    readonly melody_beep: MelodyBeepController,
    readonly melody_color: MelodyColorController,
    readonly hierarchy: HierarchyLevelController,
  },
): MelodyElements {
  const d_melody_collection = buildDMelody(d_melodies, controllers);
  const melody_hierarchy = buildMelody(hierarchical_melody, controllers);
  const ir_hierarchy = buildIRSymbol(hierarchical_melody, controllers);
  const ir_plot_svg = buildIRPlot(hierarchical_melody, controllers);
  const ir_gravity = buildIRGravity(hierarchical_melody, controllers);
  const chord_gravities = buildGravity("chord_gravity", hierarchical_melody, controllers);
  const scale_gravities = buildGravity("scale_gravity", hierarchical_melody, controllers);
  const time_span_tree = buildReduction(hierarchical_melody, controllers);

  const children = [
    d_melody_collection,
    melody_hierarchy,
    ir_hierarchy,
    ir_plot_svg,
    chord_gravities,
    scale_gravities,
    time_span_tree,
  ];

  return {
    children,
    d_melody_collection,
    melody_hierarchy,
    ir_hierarchy,
    ir_plot_svg,
    ir_gravity,
    chord_gravities,
    scale_gravities,
    time_span_tree,
  };
}
