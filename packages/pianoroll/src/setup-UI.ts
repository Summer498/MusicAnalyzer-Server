import { getBlackBGs, getBlackKeys, getCurrentTimeLine, getOctaveBGs, getOctaveKeys, getWhiteBGs, getWhiteKeys, PianoRoll } from "@music-analyzer/svg-objects";
import { Assertion, _throw } from "@music-analyzer/stdlib";
import { CurrentTimeRatio } from "@music-analyzer/view-parameters";
import { SongLength } from "@music-analyzer/view-parameters";
import { ControllerUIs, ChordGravityMediator, DMelodyMediator, HierarchyLevelMediator, MelodyBeepMediator, MelodyVolumeMediator, ScaleGravityMediator, TimeRangeMediator } from "@music-analyzer/piano-roll";
import { AccompanyToAudioRegistry } from "@music-analyzer/view";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { BeatElements, ChordElements, MelodyElements } from "@music-analyzer/piano-roll/src/piano-roll";

declare const audio_player: HTMLAudioElement | HTMLVideoElement;

const NO_CHORD = false;  // コード関連のものを表示しない
const FULL_VIEW = true;  // 横いっぱいに分析結果を表示
if (FULL_VIEW) {
  CurrentTimeRatio.value = 0.025;
  audio_player.autoplay = false;
}

export const setupUI = (
  beat_info: BeatInfo,
  romans: TimeAndRomanAnalysis[],
  hierarchical_melody: IMelodyModel[][],
  // melodies: IMelodyModel[],
  d_melodies: IMelodyModel[],
  place: HTMLDivElement,
  audio_element: HTMLAudioElement | HTMLVideoElement
) => {
  new Assertion(hierarchical_melody.length > 0).onFailed(() => { throw new Error(`hierarchical melody length must be more than 0 but it is ${hierarchical_melody.length}`); });
  const melodies = hierarchical_melody[hierarchical_melody.length - 1];
  SongLength.value = Math.max(
    ...melodies.map(e => e.end)
  ) * 1.05; // ちょっとマージンを取っておく


  // 奥側
  const octave_bgs = document.createElementNS("http://www.w3.org/2000/svg", "g");
  octave_bgs.id = "octave-BGs";
  getOctaveBGs(getWhiteBGs(), getBlackBGs()).svg
    .forEach(e => octave_bgs.appendChild(e.svg));

  const c = new ControllerUIs();
  const last = <T>(arr: T[]) => arr[arr.length - 1];
  const beat = new BeatElements(beat_info, last(hierarchical_melody));
  const chord = new ChordElements(romans);
  const melody = new MelodyElements(hierarchical_melody, d_melodies);

  const d_melody_switcher_mediator = new DMelodyMediator(c.d_melody_switcher, melody.d_melody_collection);
  const scale_gravity_switcher_mediator = new ScaleGravityMediator(c.scale_gravity_switcher, melody.scale_gravities);
  const chord_gravity_switcher_mediator = new ChordGravityMediator(c.chord_gravity_switcher, melody.chord_gravities);
  const hierarchy_level_slider_mediator = new HierarchyLevelMediator(c.hierarchy_level, melody.melody_hierarchy, melody.ir_hierarchy, melody.ir_plot, melody.time_span_tree, melody.scale_gravities, melody.chord_gravities);
  const melody_beep_switcher_mediator = new MelodyBeepMediator(c.melody_beep_switcher, melody.melody_hierarchy);
  const melody_beep_volume_mediator = new MelodyVolumeMediator(c.melody_beep_volume, melody.melody_hierarchy);
  const time_range_slider_mediator = new TimeRangeMediator(c.time_range_slider, AccompanyToAudioRegistry.instance);

  const piano_roll_view = new PianoRoll();
  piano_roll_view.svg.appendChild(octave_bgs);
  piano_roll_view.svg.appendChild(beat.beat_bars.svg);
  piano_roll_view.svg.appendChild(chord.chord_notes.svg);
  piano_roll_view.svg.appendChild(chord.chord_names.svg);
  piano_roll_view.svg.appendChild(chord.chord_romans.svg);
  piano_roll_view.svg.appendChild(chord.chord_keys.svg);
  piano_roll_view.svg.appendChild(melody.d_melody_collection.svg);
  piano_roll_view.svg.appendChild(melody.melody_hierarchy.svg);
  piano_roll_view.svg.appendChild(melody.ir_hierarchy.svg);
  piano_roll_view.svg.appendChild(melody.chord_gravities.svg);
  piano_roll_view.svg.appendChild(melody.scale_gravities.svg);
  piano_roll_view.svg.appendChild(melody.time_span_tree.svg);
  const octave_keys = document.createElementNS("http://www.w3.org/2000/svg", "g");
  octave_keys.id = "octave-keys";
  getOctaveKeys(getWhiteKeys(), getBlackKeys()).svg
    .forEach(e => octave_keys.appendChild(e.svg));
  piano_roll_view.svg.appendChild(octave_keys);
  if (!FULL_VIEW) {
    piano_roll_view.svg.appendChild(getCurrentTimeLine().svg);
  }
  // 手前側

  const d_melody_div = document.createElement("div");
  d_melody_div.id = "d-melody";
  d_melody_div.appendChild(c.d_melody_switcher.body);
  const hierarchy_level_div = document.createElement("div");
  hierarchy_level_div.id = "hierarchy-level";
  hierarchy_level_div.appendChild(c.hierarchy_level.body);
  const time_length_div = document.createElement("div");
  time_length_div.id = "time-length";
  time_length_div.appendChild(c.time_range_slider.body);
  const gravity_switcher_div = document.createElement("div");
  gravity_switcher_div.id = "gravity-switcher";
  gravity_switcher_div.appendChild(c.scale_gravity_switcher.body);
  gravity_switcher_div.appendChild(c.chord_gravity_switcher.body);
  const melody_beep_controllers_div = document.createElement("div");
  melody_beep_controllers_div.appendChild(c.melody_beep_switcher.body,);
  melody_beep_controllers_div.appendChild(c.melody_beep_volume.body);
  melody_beep_controllers_div.id = "melody-beep-controllers";
  const melody_color_selector_div = document.createElement("div");
  melody_color_selector_div.id = "melody-color-selector";
  melody_color_selector_div.style.display = "inline";
  melody_color_selector_div.appendChild(c.melody_color_selector.body);
  const controllers = document.createElement("div");
  controllers.id = "controllers";
  controllers.style = "margin-top:20px";
  //  controllers.appendChild(d_melody_div);
  controllers.appendChild(hierarchy_level_div);
  controllers.appendChild(time_length_div);
  if (!NO_CHORD) {
    controllers.appendChild(gravity_switcher_div);
  }
  controllers.appendChild(melody_beep_controllers_div);
  //  controllers.appendChild(melody_color_selector_div);  // NOTE: 色選択は未実装なので消しておく


  const ir_plot = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  ir_plot.appendChild(melody.ir_plot.svg);
  ir_plot.id = "IR-plot";
  ir_plot.style.width = melody.ir_plot.svg.style.width;
  ir_plot.style.height = melody.ir_plot.svg.style.height;


  const bottom = document.createElement("div");
  bottom.appendChild(controllers);
  bottom.appendChild(ir_plot);
  bottom.setAttribute("style", `column-count: ${2}`);
  place.appendChild(piano_roll_view.svg);
  place.appendChild(audio_element);
  place.appendChild(bottom);
};
