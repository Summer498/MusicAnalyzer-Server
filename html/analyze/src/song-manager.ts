import { ChordGravitySwitcherMediator, DMelodySwitcherMediator, HierarchyLevelSliderMediator, MelodyBeepSwitcherMediator, MelodyBeepVolumeMediator, PianoRollController, ScaleGravitySwitcherMediator, SongManager, TimeRangeSliderMediator } from "@music-analyzer/piano-roll";
import { getBlackBGs, getBlackKeys, getCurrentTimeLine, getOctaveBGs, getOctaveKeys, getWhiteBGs, getWhiteKeys, PianoRoll } from "@music-analyzer/svg-objects";
import { Assertion, _throw } from "@music-analyzer/stdlib";
import { CurrentTimeRatio } from "@music-analyzer/view-parameters";
import { SongLength } from "@music-analyzer/view-parameters";

declare const audio_player: HTMLAudioElement | HTMLVideoElement;

const NO_CHORD = false;  // コード関連のものを表示しない
const FULL_VIEW = false;  // 横いっぱいに分析結果を表示
if (FULL_VIEW) {
  CurrentTimeRatio.value = 0.025;
  audio_player.autoplay = false;
}

export const setupUI = (song_manager: SongManager, piano_roll_place: HTMLDivElement, controller_place: HTMLDivElement) => {
  const piano_roll_view = new PianoRoll();

  new Assertion(song_manager.hierarchical_melody.length > 0).onFailed(() => { throw new Error(`hierarchical melody length must be more than 0 but it is ${song_manager.hierarchical_melody.length}`); });
  const melodies = song_manager.hierarchical_melody[song_manager.hierarchical_melody.length - 1];
  SongLength.value = Math.max(
    ...melodies.map(e => e.end)
  ) * 1.05; // ちょっとマージンを取っておく


  // 奥側
  const octave_bgs = document.createElementNS("http://www.w3.org/2000/svg", "g");
  octave_bgs.id = "octave-BGs";
  getOctaveBGs(getWhiteBGs(), getBlackBGs()).svg
    .forEach(e => octave_bgs.appendChild(e.svg));

  const piano_roll_controller = new PianoRollController(song_manager);
  const d_melody_switcher_mediator = new DMelodySwitcherMediator(piano_roll_controller.d_melody_switcher, piano_roll_controller.d_melody_collection);
  const scale_gravity_switcher_mediator = new ScaleGravitySwitcherMediator(piano_roll_controller.scale_gravity_switcher, piano_roll_controller.scale_gravities);
  const chord_gravity_switcher_mediator = new ChordGravitySwitcherMediator(piano_roll_controller.chord_gravity_switcher, piano_roll_controller.chord_gravities);
  const hierarchy_level_slider_mediator = new HierarchyLevelSliderMediator(piano_roll_controller.hierarchy_level, piano_roll_controller.melody_hierarchy, piano_roll_controller.ir_hierarchy, piano_roll_controller.ir_plot, piano_roll_controller.time_span_tree, piano_roll_controller.scale_gravities, piano_roll_controller.chord_gravities);
  const melody_beep_switcher_mediator = new MelodyBeepSwitcherMediator(piano_roll_controller.melody_beep_switcher, piano_roll_controller.melody_hierarchy);
  const melody_beep_volume_mediator = new MelodyBeepVolumeMediator(piano_roll_controller.melody_beep_volume, piano_roll_controller.melody_hierarchy);
  const time_range_slider_mediator = new TimeRangeSliderMediator(piano_roll_controller.time_range_slider, piano_roll_controller.accompany_to_audio_registry);

  piano_roll_view.svg.appendChild(octave_bgs);
  //  piano_roll.svg.appendChild(beat_bars.svg);
  piano_roll_view.svg.appendChild(piano_roll_controller.chord_notes.svg);
  piano_roll_view.svg.appendChild(piano_roll_controller.chord_names.svg);
  piano_roll_view.svg.appendChild(piano_roll_controller.chord_romans.svg);
  piano_roll_view.svg.appendChild(piano_roll_controller.chord_keys.svg);
  piano_roll_view.svg.appendChild(piano_roll_controller.d_melody_collection.svg);
  piano_roll_view.svg.appendChild(piano_roll_controller.melody_hierarchy.svg);
  piano_roll_view.svg.appendChild(piano_roll_controller.ir_hierarchy.svg);
  piano_roll_view.svg.appendChild(piano_roll_controller.chord_gravities.svg);
  piano_roll_view.svg.appendChild(piano_roll_controller.scale_gravities.svg);
  piano_roll_view.svg.appendChild(piano_roll_controller.time_span_tree.svg);
  const octave_keys = document.createElementNS("http://www.w3.org/2000/svg", "g");
  octave_keys.id = "octave-keys";
  getOctaveKeys(getWhiteKeys(), getBlackKeys()).svg
    .forEach(e => octave_keys.appendChild(e.svg));
  piano_roll_view.svg.appendChild(octave_keys);
  if (!FULL_VIEW) {
    piano_roll_view.svg.appendChild(getCurrentTimeLine().svg);
  }
  // 手前側


  piano_roll_place.insertAdjacentElement("beforeend", piano_roll_view.svg);

  const d_melody_div = document.createElement("div");
  d_melody_div.id = "d-melody";
  d_melody_div.appendChild(piano_roll_controller.d_melody_switcher.body);
  const hierarchy_level_div = document.createElement("div");
  hierarchy_level_div.id = "hierarchy-level";
  hierarchy_level_div.appendChild(piano_roll_controller.hierarchy_level.body);
  const time_length_div = document.createElement("div");
  time_length_div.id = "time-length";
  time_length_div.appendChild(piano_roll_controller.time_range_slider.body);
  const gravity_switcher_div = document.createElement("div");
  gravity_switcher_div.id = "gravity-switcher";
  gravity_switcher_div.appendChild(piano_roll_controller.scale_gravity_switcher.body);
  gravity_switcher_div.appendChild(piano_roll_controller.chord_gravity_switcher.body);
  const melody_beep_controllers_div = document.createElement("div");
  melody_beep_controllers_div.appendChild(piano_roll_controller.melody_beep_switcher.body,);
  melody_beep_controllers_div.appendChild(piano_roll_controller.melody_beep_volume.body);
  melody_beep_controllers_div.id = "melody-beep-controllers";
  const melody_color_selector_div = document.createElement("div");
  melody_color_selector_div.id = "melody-color-selector";
  melody_color_selector_div.style.display = "inline";
  melody_color_selector_div.appendChild(piano_roll_controller.melody_color_selector.body);
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
  controller_place.insertAdjacentElement("beforeend", controllers);

  const ir_plot = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  ir_plot.appendChild(piano_roll_controller.ir_plot.svg);
  ir_plot.style.width = piano_roll_controller.ir_plot.svg.style.width;
  ir_plot.style.height = piano_roll_controller.ir_plot.svg.style.height;
  controller_place.insertAdjacentElement("beforeend", ir_plot);
  controller_place.setAttribute("style", `column-count: ${2}`);
};
