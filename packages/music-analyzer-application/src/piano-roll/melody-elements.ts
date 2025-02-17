import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { ChordGravityHierarchy, DMelodyGroup, IRPlotHierarchy, IRSymbolHierarchy, MelodyHierarchy, ScaleGravityHierarchy, TSRHierarchy } from "@music-analyzer/melody-view";

export class MelodyElements {
  readonly d_melody_collection: DMelodyGroup;
  readonly melody_hierarchy: MelodyHierarchy;
  readonly ir_hierarchy: IRSymbolHierarchy;
  readonly ir_plot: IRPlotHierarchy;
  readonly chord_gravities: ChordGravityHierarchy;
  readonly scale_gravities: ScaleGravityHierarchy;
  readonly time_span_tree: TSRHierarchy;
  constructor(
    hierarchical_melody: IMelodyModel[][],
    d_melodies: IMelodyModel[]
  ){
    this.d_melody_collection = new DMelodyGroup(d_melodies);
    this.melody_hierarchy = new MelodyHierarchy(hierarchical_melody);
    this.ir_hierarchy = new IRSymbolHierarchy(hierarchical_melody);
    this.ir_plot = new IRPlotHierarchy(hierarchical_melody);
    this.chord_gravities = new ChordGravityHierarchy(hierarchical_melody);
    this.scale_gravities = new ScaleGravityHierarchy(hierarchical_melody);
    this.time_span_tree = new TSRHierarchy(hierarchical_melody);
  }
}
