import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { DMelodySeries } from "./d-melody-series";
import { ReductionHierarchy } from "./reduction-hierarchy";
import { GravityHierarchy } from "./gravity-hierarchy";
import { IRPlotSVG } from "./ir-plot-svg";
import { HierarchyBuilder } from "./hierarchy-builder";
import { IRSymbolHierarchy } from "./ir-symbol-hierarchy";
import { MelodyHierarchy } from "./melody-hierarchy";
import { RequiredByMelodyElements } from "./required-by-melody-elements";

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
    this.d_melody_collection = builder.buildDMelody(d_melodies, controllers);
    this.melody_hierarchy = builder.buildMelody(hierarchical_melody, controllers);
    this.ir_hierarchy = builder.buildIRSymbol(hierarchical_melody, controllers);
    this.ir_plot_svg = builder.buildIRPlot(hierarchical_melody, controllers);
    this.chord_gravities = builder.buildGravity("chord_gravity", hierarchical_melody, controllers, chord_checkbox);
    this.scale_gravities = builder.buildGravity("scale_gravity", hierarchical_melody, controllers, scale_checkbox);
    this.time_span_tree = builder.buildReduction(hierarchical_melody, controllers);
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
