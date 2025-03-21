import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { GravityHierarchy, DMelodySeries, IRSymbolHierarchy, MelodyHierarchy, ReductionHierarchy, IRPlot } from "@music-analyzer/melody-view";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { Controllers } from "../controllers";

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
    controllers: Controllers,
    publisher: [AudioReflectableRegistry, WindowReflectableRegistry]
  ) {
    const { gravity } = controllers;
    const [audio, window] = publisher;
    const publishers = { ...controllers, audio, window }

    this.d_melody_collection = new DMelodySeries(d_melodies, publishers);
    this.melody_hierarchy = new MelodyHierarchy(hierarchical_melody, publishers);
    this.ir_hierarchy = new IRSymbolHierarchy(hierarchical_melody, publishers);
    this.ir_plot = new IRPlot(hierarchical_melody, publishers);
    this.chord_gravities = new GravityHierarchy("chord_gravity", hierarchical_melody, { ...publishers, switcher: gravity.chord_checkbox });
    this.scale_gravities = new GravityHierarchy("scale_gravity", hierarchical_melody, { ...publishers, switcher: gravity.scale_checkbox });
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
