import { DMelodySwitcher, GravitySwitcher, HierarchyLevel, MelodyBeepSwitcher, MelodyBeepVolume, MelodyColorSelector, TimeRangeSlider } from "@music-analyzer/controllers";
import { SvgCollection } from "@music-analyzer/view";
import { CHordKeyGroup, ChordNameGroup, ChordNotesGroup, ChordRomanGroup } from "@music-analyzer/chord-view";
import { DMelodyGroup, ChordGravityGroup, IRSymbolGroup, MelodyGroup, ScaleGravityGroup, TSRGroup } from "@music-analyzer/melody-view";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { BeatBarsGroup } from "@music-analyzer/beat-view/";

export class SongManager {
  readonly beat_info: BeatInfo;
  readonly romans: TimeAndRomanAnalysis[];
  readonly hierarchical_melody: IMelodyModel[][];
  // readonly melodies: IMelodyModel[];
  readonly d_melodies: IMelodyModel[];
  constructor(
    beat_info: BeatInfo,
    romans: TimeAndRomanAnalysis[],
    hierarchical_melody: IMelodyModel[][],
    // melodies: IMelodyModel[],
    d_melodies: IMelodyModel[]
  ) {
    this.beat_info = beat_info;
    this.romans = romans;
    this.hierarchical_melody = hierarchical_melody;
    // this.melodies = melodies;
    this.d_melodies = d_melodies;
  }
}

export class PianoRollController1 {
  readonly d_melody_switcher: DMelodySwitcher;
  readonly hierarchy_level: HierarchyLevel;
  readonly time_range_slider: TimeRangeSlider;
  readonly key_gravity_switcher: GravitySwitcher;
  readonly chord_gravity_switcher: GravitySwitcher;
  readonly melody_beep_switcher: MelodyBeepSwitcher;
  readonly melody_beep_volume: MelodyBeepVolume;
  readonly melody_color_selector: MelodyColorSelector;
  constructor() {
    this.d_melody_switcher = new DMelodySwitcher();
    this.hierarchy_level = new HierarchyLevel();
    this.time_range_slider = new TimeRangeSlider();
    this.key_gravity_switcher = new GravitySwitcher("key_gravity_switcher", "Key Gravity", []);
    this.chord_gravity_switcher = new GravitySwitcher("chord_gravity_switcher", "Chord Gravity", []);
    this.melody_beep_switcher = new MelodyBeepSwitcher();
    this.melody_beep_volume = new MelodyBeepVolume();
    this.melody_color_selector = new MelodyColorSelector();
  }
}

const getMelody = (hierarchical_melody: IMelodyModel[][]) => hierarchical_melody[hierarchical_melody.length - 1];

export class PianoRollController2 {
  readonly beat_bars: SvgCollection;
  readonly chord_notes: SvgCollection;
  readonly chord_names: SvgCollection;
  readonly chord_romans: SvgCollection;
  readonly chord_keys: SvgCollection;
  readonly d_melody_controllers: SvgCollection;
  readonly melody_group: { readonly svg: SVGGElement };
  readonly ir_group: { readonly svg: SVGGElement };
  readonly chord_gravities: { readonly svg: SVGGElement };
  readonly scale_gravities: { readonly svg: SVGGElement };
  readonly time_span_tree: { readonly svg: SVGGElement };
  readonly input_controller: PianoRollController1;

  constructor(song_manager: SongManager) {
    this.input_controller = new PianoRollController1();
    this.beat_bars = new BeatBarsGroup(
      song_manager.beat_info,
      getMelody(song_manager.hierarchical_melody)
    );
    this.chord_notes = new ChordNotesGroup(song_manager.romans);
    this.chord_names = new ChordNameGroup(song_manager.romans);
    this.chord_romans = new ChordRomanGroup(song_manager.romans);
    this.chord_keys = new CHordKeyGroup(song_manager.romans);
    this.d_melody_controllers = new DMelodyGroup(song_manager.d_melodies,
      this.input_controller.d_melody_switcher);
    this.melody_group = new MelodyGroup(song_manager.hierarchical_melody,
      this.input_controller.hierarchy_level,
      this.input_controller.melody_beep_switcher,
      this.input_controller.melody_beep_volume);
    this.ir_group = new IRSymbolGroup(song_manager.hierarchical_melody,
      this.input_controller.hierarchy_level);
    this.chord_gravities = new ChordGravityGroup(song_manager.hierarchical_melody,
      this.input_controller.hierarchy_level);
    this.scale_gravities = new ScaleGravityGroup(song_manager.hierarchical_melody,
      this.input_controller.hierarchy_level);
    this.time_span_tree = new TSRGroup(song_manager.hierarchical_melody,
      this.input_controller.hierarchy_level);
  }
}
