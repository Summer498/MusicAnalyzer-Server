import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { GravityHierarchy, DMelodyGroup, IRPlotHierarchy, IRSymbolHierarchy, MelodyHierarchy, TSRHierarchy } from "@music-analyzer/melody-view";

export class MelodyElements {
  readonly d_melody_collection: DMelodyGroup;
  readonly melody_hierarchy: MelodyHierarchy;
  readonly ir_hierarchy: IRSymbolHierarchy;
  readonly ir_plot: IRPlotHierarchy;
  readonly chord_gravities: GravityHierarchy;
  readonly scale_gravities: GravityHierarchy;
  readonly time_span_tree: TSRHierarchy;
  constructor(
    hierarchical_melody: IMelodyModel[][],
    d_melodies: IMelodyModel[]
  ) {
    this.d_melody_collection = new DMelodyGroup(d_melodies);
    this.melody_hierarchy = new MelodyHierarchy(hierarchical_melody);
    this.ir_hierarchy = new IRSymbolHierarchy(hierarchical_melody);
    this.ir_plot = new IRPlotHierarchy(hierarchical_melody);
    this.chord_gravities = new GravityHierarchy("chord_gravity", hierarchical_melody);
    this.scale_gravities = new GravityHierarchy("scale_gravity", hierarchical_melody);
    this.time_span_tree = new TSRHierarchy(hierarchical_melody);
  }
}
