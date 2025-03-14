import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { GravityHierarchy, DMelodyGroup, IRPlotHierarchy, IRSymbolHierarchy, MelodyHierarchy, ReductionHierarchy } from "@music-analyzer/melody-view";
import { IRPlot } from "@music-analyzer/melody-view/src/ir-plot/ir-plot";
import { AudioReflectable, WindowReflectable } from "@music-analyzer/view";

export class MelodyElements implements AudioReflectable, WindowReflectable {
  readonly children: (AudioReflectable & WindowReflectable)[];
  readonly d_melody_collection: DMelodyGroup;
  readonly melody_hierarchy: MelodyHierarchy;
  readonly ir_hierarchy: IRSymbolHierarchy;
  readonly ir_plot: IRPlot;
  readonly chord_gravities: GravityHierarchy;
  readonly scale_gravities: GravityHierarchy;
  readonly time_span_tree: ReductionHierarchy;
  constructor(
    hierarchical_melody: TimeAndAnalyzedMelody[][],
    d_melodies: TimeAndAnalyzedMelody[]
  ) {
    this.d_melody_collection = new DMelodyGroup(d_melodies);
    this.melody_hierarchy = new MelodyHierarchy(hierarchical_melody);
    this.ir_hierarchy = new IRSymbolHierarchy(hierarchical_melody);
    this.ir_plot = new IRPlot(new IRPlotHierarchy(hierarchical_melody));
    this.chord_gravities = new GravityHierarchy("chord_gravity", hierarchical_melody);
    this.scale_gravities = new GravityHierarchy("scale_gravity", hierarchical_melody);
    this.time_span_tree = new ReductionHierarchy(hierarchical_melody);
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
  onAudioUpdate() {
    this.children.forEach(e => e.onAudioUpdate());
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}
