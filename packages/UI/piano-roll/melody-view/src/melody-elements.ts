import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { GravityController } from "@music-analyzer/controllers/src/switcher/gravity/gravity-controller";
import { DMelodySeries } from "./d-melody/d-melody-series";
import { RequiredByDMelodySeries } from "./d-melody/d-melody-series";
import { MelodyHierarchy } from "./melody/melody-hierarchy";
import { RequiredByMelodyHierarchy } from "./melody/melody-hierarchy";
import { IRSymbolHierarchy } from "./ir-symbol/ir-symbol-hierarchy";
import { RequiredByIRSymbolHierarchy } from "./ir-symbol/ir-symbol-hierarchy";
import { RequiredByIRPlot } from "./ir-plot/ir-plot/ir-plot";
import { ReductionHierarchy } from "./reduction/reduction-hierarchy";
import { RequiredByReductionHierarchy } from "./reduction/reduction-hierarchy";
import { GravityHierarchy } from "./gravity/gravity-hierarchy";
import { IRPlotSVG } from "./ir-plot/ir-plot-svg";

export interface RequiredByMelodyElements
  extends
  RequiredByDMelodySeries,
  RequiredByMelodyHierarchy,
  RequiredByIRSymbolHierarchy,
  RequiredByIRPlot,
  RequiredByReductionHierarchy {
    readonly gravity: GravityController
  }

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
    hierarchical_melody: TimeAndAnalyzedMelody[][],
    d_melodies: TimeAndAnalyzedMelody[],
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
