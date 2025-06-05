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

export class MelodyElements {
  readonly children: SVGGElement[];
  readonly d_melody_collection: SVGGElement;
  readonly melody_hierarchy: SVGGElement;
  readonly ir_hierarchy: SVGGElement;
  readonly ir_plot_svg: SVGSVGElement;
  readonly ir_gravity: SVGGElement;
  readonly chord_gravities: SVGGElement;
  readonly scale_gravities: SVGGElement;
  readonly time_span_tree: SVGGElement;
  constructor(
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
    }
  ) {
    this.d_melody_collection = buildDMelody(d_melodies, controllers);
    this.melody_hierarchy = buildMelody(hierarchical_melody, controllers);
    this.ir_hierarchy = buildIRSymbol(hierarchical_melody, controllers);
    this.ir_plot_svg = buildIRPlot(hierarchical_melody, controllers);
    this.ir_gravity = buildIRGravity(hierarchical_melody, controllers);
    this.chord_gravities = buildGravity("chord_gravity", hierarchical_melody, controllers);
    this.scale_gravities = buildGravity("scale_gravity", hierarchical_melody, controllers);
    this.time_span_tree = buildReduction(hierarchical_melody, controllers);

    this.children = [
      this.d_melody_collection,
      this.melody_hierarchy,
      this.ir_hierarchy,
      this.ir_plot_svg,
      this.chord_gravities,
      this.scale_gravities,
      this.time_span_tree,
    ];
  }
}
