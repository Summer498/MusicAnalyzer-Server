import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { DMelodySeries } from "./layer/d-melody-series";
import { MelodyHierarchy } from "./hierarchy/melody-hierarchy";
import { IRSymbolHierarchy } from "./hierarchy/ir-symbol-hierarchy";
import { ReductionHierarchy } from "./hierarchy/reduction-hierarchy";
import { GravityHierarchy } from "./hierarchy/gravity-hierarchy";
import { IRPlotSVG } from "./ir-plot-svg";
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
    const publishers = { ...controllers }

    this.d_melody_collection = new DMelodySeries(d_melodies, publishers);
    this.melody_hierarchy = new MelodyHierarchy(hierarchical_melody, publishers);
    this.ir_hierarchy = new IRSymbolHierarchy(hierarchical_melody, publishers);
    this.ir_plot_svg = new IRPlotSVG(hierarchical_melody, publishers);
    this.chord_gravities = new GravityHierarchy("chord_gravity", hierarchical_melody, { ...publishers, switcher: chord_checkbox });
    this.scale_gravities = new GravityHierarchy("scale_gravity", hierarchical_melody, { ...publishers, switcher: scale_checkbox });
    this.time_span_tree = new ReductionHierarchy(hierarchical_melody, publishers);
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
