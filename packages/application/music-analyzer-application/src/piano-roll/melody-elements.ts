import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { GravityHierarchy, DMelodyGroup, IRSymbolHierarchy, MelodyHierarchy, ReductionHierarchy, IRPlot } from "@music-analyzer/melody-view";
import { AudioReflectable, WindowReflectable } from "@music-analyzer/view";
import { Controllers } from "../controllers";

export class MelodyElements
  implements AudioReflectable, WindowReflectable {
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
    d_melodies: TimeAndAnalyzedMelody[],
    controllers: Controllers,
  ) {
    const { d_melody, hierarchy, time_range, gravity, melody_color, melody_beep } = controllers;

    this.d_melody_collection = new DMelodyGroup(d_melodies, [d_melody]);
    this.melody_hierarchy = new MelodyHierarchy(hierarchical_melody, [hierarchy, melody_beep, melody_color]);
    this.ir_hierarchy = new IRSymbolHierarchy(hierarchical_melody, [hierarchy, melody_color]);
    this.ir_plot = new IRPlot(hierarchical_melody, [hierarchy, melody_color]);
    this.chord_gravities = new GravityHierarchy("chord_gravity", hierarchical_melody, [gravity.chord_checkbox, hierarchy]);
    this.scale_gravities = new GravityHierarchy("scale_gravity", hierarchical_melody, [gravity.scale_checkbox, hierarchy]);
    this.time_span_tree = new ReductionHierarchy(hierarchical_melody, [hierarchy, melody_color]);
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
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
