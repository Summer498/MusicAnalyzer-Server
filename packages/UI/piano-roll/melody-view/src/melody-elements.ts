import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { GravityController } from "@music-analyzer/controllers";
import { DMelodySeries } from "./d-melody";
import { RequiredByDMelodySeries } from "./d-melody";
import { MelodyHierarchy } from "./melody";
import { RequiredByMelodyHierarchy } from "./melody";
import { IRSymbolHierarchy } from "./ir-symbol";
import { RequiredByIRSymbolHierarchy } from "./ir-symbol";
import { IRPlot } from "./ir-plot";
import { RequiredByIRPlot } from "./ir-plot";
import { ReductionHierarchy } from "./reduction";
import { RequiredByReductionHierarchy } from "./reduction";
import { GravityHierarchy } from "./gravity";

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
  readonly ir_plot: IRPlot;
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
    this.ir_plot = new IRPlot(hierarchical_melody, publishers);
    this.chord_gravities = new GravityHierarchy("chord_gravity", hierarchical_melody, { ...publishers, switcher: chord_checkbox });
    this.scale_gravities = new GravityHierarchy("scale_gravity", hierarchical_melody, { ...publishers, switcher: scale_checkbox });
    this.time_span_tree = new ReductionHierarchy(hierarchical_melody, publishers);
    this.children = [
      this.d_melody_collection,
      this.melody_hierarchy,
      this.ir_hierarchy,
      this.ir_plot,
      this.chord_gravities,
      this.scale_gravities,
      this.time_span_tree,
    ];
  }
}
