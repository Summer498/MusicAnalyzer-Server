import { PianoRollController2, registerListener, SongManager } from "@music-analyzer/piano-roll";
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

export const appendPianoRoll = (piano_roll_place: HTMLDivElement, song_manager: SongManager) => {
  const piano_roll = new PianoRoll();

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

  const analyzed_svgs = new PianoRollController2(song_manager);
  registerListener(analyzed_svgs, analyzed_svgs.input_controller);

  piano_roll.svg.appendChild(octave_bgs);
  //  piano_roll.svg.appendChild(beat_bars.svg);
  if (!NO_CHORD) {
    piano_roll.svg.appendChild(analyzed_svgs.chord_notes.svg);
    piano_roll.svg.appendChild(analyzed_svgs.chord_names.svg);
    piano_roll.svg.appendChild(analyzed_svgs.chord_romans.svg);
    piano_roll.svg.appendChild(analyzed_svgs.chord_keys.svg);
  }
  piano_roll.svg.appendChild(analyzed_svgs.d_melody_controllers.svg);
  piano_roll.svg.appendChild(analyzed_svgs.melody_group.svg);
  piano_roll.svg.appendChild(analyzed_svgs.ir_group.svg);
  if (!NO_CHORD) {
    piano_roll.svg.appendChild(analyzed_svgs.chord_gravities.svg);
    piano_roll.svg.appendChild(analyzed_svgs.scale_gravities.svg);
  }
  piano_roll.svg.appendChild(analyzed_svgs.time_span_tree.svg);
  const octave_keys = document.createElementNS("http://www.w3.org/2000/svg", "g");
  octave_keys.id = "octave-keys";
  getOctaveKeys(getWhiteKeys(), getBlackKeys()).svg
    .forEach(e => octave_keys.appendChild(e.svg));
  piano_roll.svg.appendChild(octave_keys);
  if (!FULL_VIEW) {
    piano_roll.svg.appendChild(getCurrentTimeLine().svg);
  }
  // 手前側


  piano_roll_place.insertAdjacentElement("beforeend", piano_roll.svg);

  return analyzed_svgs;
};

export const appendController = (controller_place: HTMLDivElement, piano_roll: PianoRollController2) => {
  const d_melody_div = document.createElement("div");
  d_melody_div.id = "d-melody";
  d_melody_div.appendChild(piano_roll.input_controller.d_melody_switcher.body);
  const hierarchy_level_div = document.createElement("div");
  hierarchy_level_div.id = "hierarchy-level";
  hierarchy_level_div.appendChild(piano_roll.input_controller.hierarchy_level.body);
  const time_length_div = document.createElement("div");
  time_length_div.id = "time-length";
  time_length_div.appendChild(piano_roll.input_controller.time_range_slider.body);
  const gravity_switcher_div = document.createElement("div");
  gravity_switcher_div.id = "gravity-switcher";
  gravity_switcher_div.appendChild(piano_roll.input_controller.key_gravity_switcher.body);
  gravity_switcher_div.appendChild(piano_roll.input_controller.chord_gravity_switcher.body);
  const melody_beep_controllers_div = document.createElement("div");
  melody_beep_controllers_div.appendChild(piano_roll.input_controller.melody_beep_switcher.body,);
  melody_beep_controllers_div.appendChild(piano_roll.input_controller.melody_beep_volume.body);
  melody_beep_controllers_div.id = "melody-beep-controllers";
  const melody_color_selector_div = document.createElement("div");
  melody_color_selector_div.id = "melody-color-selector";
  melody_color_selector_div.style.display = "inline";
  melody_color_selector_div.appendChild(piano_roll.input_controller.melody_color_selector.body);
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
  ir_plot.appendChild(piano_roll.ir_plot.svg);
  ir_plot.style.width = piano_roll.ir_plot.svg.style.width;
  ir_plot.style.height = piano_roll.ir_plot.svg.style.height;
  controller_place.insertAdjacentElement("beforeend", ir_plot);
  controller_place.setAttribute("style", `column-count: ${2}`);
};
