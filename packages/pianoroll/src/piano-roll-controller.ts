import { DMelodySwitcher, GravitySwitcher, HierarchyLevel, MelodyBeepSwitcher, MelodyBeepVolume, MelodyColorSelector, TimeRangeSlider } from "@music-analyzer/controllers";
import { ChordGravityHierarchy, DMelodyGroup, IRPlotHierarchy, IRSymbolHierarchy, MelodyHierarchy, ScaleGravityHierarchy, TSRHierarchy } from "@music-analyzer/melody-view";
import { AccompanyToAudioRegistry, SvgCollection, WindowReflectableRegistry } from "@music-analyzer/view";
import { SongManager } from "./song-manager";
import { BeatBarsGroup } from "@music-analyzer/beat-view";
import { CHordKeySeries, ChordNameSeries, ChordNotesSeries, ChordRomanSeries } from "@music-analyzer/chord-view";
import { IMelodyModel } from "@music-analyzer/melody-analyze";

const getMelody = (hierarchical_melody: IMelodyModel[][]) => hierarchical_melody[hierarchical_melody.length - 1];

export class PianoRollController {
  readonly d_melody_switcher: DMelodySwitcher;
  readonly hierarchy_level: HierarchyLevel;
  readonly time_range_slider: TimeRangeSlider;
  readonly scale_gravity_switcher: GravitySwitcher;
  readonly chord_gravity_switcher: GravitySwitcher;
  readonly melody_beep_switcher: MelodyBeepSwitcher;
  readonly melody_beep_volume: MelodyBeepVolume;
  readonly melody_color_selector: MelodyColorSelector;
  
  readonly beat_bars: SvgCollection;
  readonly chord_notes: SvgCollection;
  readonly chord_names: SvgCollection;
  readonly chord_romans: SvgCollection;
  readonly chord_keys: SvgCollection;
  readonly d_melody_controllers: SvgCollection;
  readonly melody_group: MelodyHierarchy;
  readonly ir_group: IRSymbolHierarchy;
  readonly ir_plot: IRPlotHierarchy;
  readonly chord_gravities: ChordGravityHierarchy;
  readonly scale_gravities: ScaleGravityHierarchy;
  readonly time_span_tree: TSRHierarchy;
  readonly accompany_to_audio_registry: AccompanyToAudioRegistry;
  readonly window_reflectable_registry: WindowReflectableRegistry;
  
  constructor(song_manager: SongManager) {
    this.d_melody_switcher = new DMelodySwitcher();
    this.hierarchy_level = new HierarchyLevel();
    this.time_range_slider = new TimeRangeSlider();
    this.scale_gravity_switcher = new GravitySwitcher("scale_gravity_switcher", "Scale Gravity");
    this.chord_gravity_switcher = new GravitySwitcher("chord_gravity_switcher", "Chord Gravity");
    this.melody_beep_switcher = new MelodyBeepSwitcher();
    this.melody_beep_volume = new MelodyBeepVolume();
    this.melody_color_selector = new MelodyColorSelector();

    this.beat_bars = new BeatBarsGroup(
      song_manager.beat_info,
      getMelody(song_manager.hierarchical_melody)
    );
    this.chord_notes = new ChordNotesSeries(song_manager.romans);
    this.chord_names = new ChordNameSeries(song_manager.romans);
    this.chord_romans = new ChordRomanSeries(song_manager.romans);
    this.chord_keys = new CHordKeySeries(song_manager.romans);
    this.d_melody_controllers = new DMelodyGroup(song_manager.d_melodies);
    this.melody_group = new MelodyHierarchy(song_manager.hierarchical_melody);
    this.ir_group = new IRSymbolHierarchy(song_manager.hierarchical_melody);
    this.ir_plot = new IRPlotHierarchy(song_manager.hierarchical_melody);
    this.chord_gravities = new ChordGravityHierarchy(song_manager.hierarchical_melody);
    this.scale_gravities = new ScaleGravityHierarchy(song_manager.hierarchical_melody);
    this.time_span_tree = new TSRHierarchy(song_manager.hierarchical_melody);
    this.accompany_to_audio_registry = AccompanyToAudioRegistry.instance;
    this.window_reflectable_registry = WindowReflectableRegistry.instance;
  }
}
