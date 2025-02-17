import { ChordGravityHierarchy, DMelodyGroup, IRPlotHierarchy, IRSymbolHierarchy, MelodyHierarchy, ScaleGravityHierarchy, TSRHierarchy } from "@music-analyzer/melody-view";
import { ChordKeySeries, ChordNameSeries, ChordNotesSeries, ChordRomanSeries } from "@music-analyzer/chord-view";
import { SvgCollection } from "@music-analyzer/view";
import { BeatBarsGroup } from "@music-analyzer/beat-view";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { IMelodyModel } from "@music-analyzer/melody-analyze";

export class BeatElements {
  readonly beat_bars: SvgCollection;
  constructor(
    beat_info: BeatInfo,
    melodies: IMelodyModel[],
  ){
    this.beat_bars = new BeatBarsGroup(
      beat_info,
      melodies
    );
  }
}

export class ChordElements {
  readonly chord_notes: SvgCollection;
  readonly chord_names: SvgCollection;
  readonly chord_romans: SvgCollection;
  readonly chord_keys: SvgCollection;
  constructor(
    romans: TimeAndRomanAnalysis[],
  ){
    this.chord_notes = new ChordNotesSeries(romans);
    this.chord_names = new ChordNameSeries(romans);
    this.chord_romans = new ChordRomanSeries(romans);
    this.chord_keys = new ChordKeySeries(romans);
  }
}

export class MelodyElements {
  readonly d_melody_collection: SvgCollection;
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
