import { ChordGravityHierarchy, DMelodyGroup, IRPlotHierarchy, IRSymbolHierarchy, MelodyHierarchy, ScaleGravityHierarchy, TSRHierarchy } from "@music-analyzer/melody-view";
import { ChordKeySeries, ChordNameSeries, ChordNotesSeries, ChordRomanSeries } from "@music-analyzer/chord-view";
import { AccompanyToAudioRegistry, SvgCollection, WindowReflectableRegistry } from "@music-analyzer/view";
import { BeatBarsGroup } from "@music-analyzer/beat-view";
import { SongManager } from "./song-manager";

const getMelody = <T>(hierarchy: T[][]) => hierarchy[hierarchy.length - 1];
export class PianoRollController {
  readonly beat_bars: SvgCollection;
  readonly chord_notes: SvgCollection;
  readonly chord_names: SvgCollection;
  readonly chord_romans: SvgCollection;
  readonly chord_keys: SvgCollection;
  readonly d_melody_collection: SvgCollection;
  readonly melody_hierarchy: MelodyHierarchy;
  readonly ir_hierarchy: IRSymbolHierarchy;
  readonly ir_plot: IRPlotHierarchy;
  readonly chord_gravities: ChordGravityHierarchy;
  readonly scale_gravities: ScaleGravityHierarchy;
  readonly time_span_tree: TSRHierarchy;
  readonly accompany_to_audio_registry: AccompanyToAudioRegistry;
  readonly window_reflectable_registry: WindowReflectableRegistry;

  constructor(song_manager: SongManager) {
    this.beat_bars = new BeatBarsGroup(
      song_manager.beat_info,
      getMelody(song_manager.hierarchical_melody)
    );
    this.chord_notes = new ChordNotesSeries(song_manager.romans);
    this.chord_names = new ChordNameSeries(song_manager.romans);
    this.chord_romans = new ChordRomanSeries(song_manager.romans);
    this.chord_keys = new ChordKeySeries(song_manager.romans);
    this.d_melody_collection = new DMelodyGroup(song_manager.d_melodies);
    this.melody_hierarchy = new MelodyHierarchy(song_manager.hierarchical_melody);
    this.ir_hierarchy = new IRSymbolHierarchy(song_manager.hierarchical_melody);
    this.ir_plot = new IRPlotHierarchy(song_manager.hierarchical_melody);
    this.chord_gravities = new ChordGravityHierarchy(song_manager.hierarchical_melody);
    this.scale_gravities = new ScaleGravityHierarchy(song_manager.hierarchical_melody);
    this.time_span_tree = new TSRHierarchy(song_manager.hierarchical_melody);
    this.accompany_to_audio_registry = AccompanyToAudioRegistry.instance;
    this.window_reflectable_registry = WindowReflectableRegistry.instance;
  }
}
