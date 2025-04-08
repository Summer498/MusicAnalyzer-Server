import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { DMelodySeries } from "./d-melody/d-melody-series";
import { ReductionHierarchy } from "./reduction/reduction-hierarchy";
import { GravityHierarchy } from "./gravity/gravity-hierarchy";
import { IRPlotSVG } from "./ir-plot/ir-plot-svg";
import { RequiredByMelodyElements } from "./required-by-melody-elements";
import { HierarchyBuilder } from "./hierarchy-builder";
import { IRSymbolHierarchy } from "./ir-symbol/ir-symbol-hierarchy";
import { MelodyHierarchy } from "./melody/melody-hierarchy";

export class MelodyElements {
  readonly children: unknown[];
  readonly d_melody_collection: DMelodySeries;
  readonly melody_hierarchy: MelodyHierarchy;
  readonly ir_hierarchy: IRSymbolHierarchy;
  readonly ir_plot_svg: IRPlotSVG;
  readonly chord_gravities: GravityHierarchy;
  readonly scale_gravities: GravityHierarchy;
  readonly time_span_tree: ReductionHierarchy;
  constructor(
    hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
    d_melodies: SerializedTimeAndAnalyzedMelody[],
    controllers: RequiredByMelodyElements & { audio: AudioReflectableRegistry, window: WindowReflectableRegistry },
  ) {
    const { chord_checkbox, scale_checkbox } = controllers.gravity;

    const builder = new HierarchyBuilder(d_melodies, hierarchical_melody, controllers)
    this.d_melody_collection = builder.buildDMelody();
    this.melody_hierarchy = builder.buildMelody();
    this.ir_hierarchy = builder.buildIRSymbol();
    this.ir_plot_svg = builder.buildIRPlot();
    this.chord_gravities = builder.buildGravity("chord_gravity", chord_checkbox);
    this.scale_gravities = builder.buildGravity("scale_gravity", scale_checkbox);
    this.time_span_tree = builder.buildReduction();
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
