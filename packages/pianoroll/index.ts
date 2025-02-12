import { DMelodySwitcher, GravitySwitcher, HierarchyLevel, MelodyBeepSwitcher, MelodyBeepVolume, MelodyColorSelector, TimeRangeSlider } from "@music-analyzer/controllers";
import { AccompanyToAudioRegistry, SvgCollection, WindowReflectableRegistry } from "@music-analyzer/view";
import { CHordKeyGroup, ChordNameGroup, ChordNotesGroup, ChordRomanGroup } from "@music-analyzer/chord-view";
import { DMelodyGroup, ChordGravityGroup, IRSymbolGroup, MelodyGroup, ScaleGravityGroup, TSRGroup } from "@music-analyzer/melody-view";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { BeatBarsGroup } from "@music-analyzer/beat-view/";
import { PianoRollRatio } from "@music-analyzer/view-parameters";
import { IRPlotGroup } from "@music-analyzer/melody-view/src/ir-plot/ir-plot";

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
    this.key_gravity_switcher = new GravitySwitcher("key_gravity_switcher", "Key Gravity");
    this.chord_gravity_switcher = new GravitySwitcher("chord_gravity_switcher", "Chord Gravity");
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
  readonly melody_group: MelodyGroup;
  readonly ir_group: IRSymbolGroup;
  readonly ir_plot: IRPlotGroup;
  readonly chord_gravities: ChordGravityGroup;
  readonly scale_gravities: ScaleGravityGroup;
  readonly time_span_tree: TSRGroup;
  readonly input_controller: PianoRollController1;
  readonly accompany_to_audio_registry: AccompanyToAudioRegistry;
  readonly window_reflectable_registry: WindowReflectableRegistry;

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
    this.d_melody_controllers = new DMelodyGroup(song_manager.d_melodies);
    this.melody_group = new MelodyGroup(song_manager.hierarchical_melody);
    this.ir_group = new IRSymbolGroup(song_manager.hierarchical_melody);
    this.ir_plot = new IRPlotGroup(song_manager.hierarchical_melody);
    this.chord_gravities = new ChordGravityGroup(song_manager.hierarchical_melody);
    this.scale_gravities = new ScaleGravityGroup(song_manager.hierarchical_melody);
    this.time_span_tree = new TSRGroup(song_manager.hierarchical_melody);
    this.accompany_to_audio_registry = AccompanyToAudioRegistry.instance;
    this.window_reflectable_registry = WindowReflectableRegistry.instance;
  }
}


export const registerListener = (piano_roll: PianoRollController2, input: PianoRollController1) => {
  function updateDMelodyVisibility(this: HTMLInputElement) {
    piano_roll.d_melody_controllers.svg.style.visibility = this.checked ? "visible" : "hidden";
  }
  input.d_melody_switcher.checkbox.addEventListener("input", updateDMelodyVisibility);
  updateDMelodyVisibility.bind(input.d_melody_switcher.checkbox)();

  function updateKeyGravityVisibility(this: HTMLInputElement) {
    piano_roll.scale_gravities.svg.style.visibility = this.checked ? "visible" : "hidden";
  }
  input.key_gravity_switcher.checkbox.addEventListener("input", updateKeyGravityVisibility);

  updateKeyGravityVisibility.bind(input.key_gravity_switcher.checkbox)();

  function updateChordGravityVisibility(this: HTMLInputElement) {
    piano_roll.chord_gravities.svg.style.visibility = this.checked ? "visible" : "hidden";
  }
  input.chord_gravity_switcher.checkbox.addEventListener("input", updateChordGravityVisibility);
  updateChordGravityVisibility.bind(input.chord_gravity_switcher.checkbox)();
  

  input.hierarchy_level.setHierarchyLevelSliderValues(piano_roll.melody_group.children.length - 1);
  function updateHierarchyLevel(this: HTMLInputElement) {
    const value = Number(this.value);
    piano_roll.melody_group.onChangedLayer(value);
    piano_roll.ir_group.onChangedLayer(value);
    piano_roll.ir_plot.onChangedLayer(value);
    piano_roll.time_span_tree.onChangedLayer(value);
    piano_roll.scale_gravities.onChangedLayer(value);
    piano_roll.chord_gravities.onChangedLayer(value);
  }
  input.hierarchy_level.range.addEventListener("input", updateHierarchyLevel);
  updateHierarchyLevel.bind(input.hierarchy_level.range)();

  function updateMelodyBeep(this: HTMLInputElement) {
    piano_roll.melody_group.onMelodyBeepCheckChanged(this.checked);
  };
  input.melody_beep_switcher.checkbox.checked = true;
  input.melody_beep_switcher.checkbox.addEventListener("input", updateMelodyBeep);
  updateMelodyBeep.bind(input.melody_beep_switcher.checkbox)();

  function updateMelodyBeepVolume(this: HTMLInputElement) {
    piano_roll.melody_group.onMelodyVolumeBarChanged(Number(this.value));
  }
  input.melody_beep_volume.range.addEventListener("input", updateMelodyBeepVolume);
  updateMelodyBeepVolume.bind(input.melody_beep_volume.range)();

  function updateTimeRange(this: HTMLInputElement) {
    input.time_range_slider.span.textContent = `${Math.floor(Math.pow(2, Number(this.value) - Number(this.max)) * 100)} %`;
    PianoRollRatio.value = Math.pow(2, Number(this.value) - Number(this.max));
    piano_roll.accompany_to_audio_registry.onAudioUpdate();
    WindowReflectableRegistry.instance.onWindowResized();
  }
  input.time_range_slider.slider.addEventListener("input", updateTimeRange);
  updateTimeRange.bind(input.time_range_slider.slider)();
};