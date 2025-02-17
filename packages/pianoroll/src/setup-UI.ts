import { getBlackBGs, getBlackKeys, getCurrentTimeLine, getOctaveBGs, getOctaveKeys, getWhiteBGs, getWhiteKeys, PianoRoll } from "@music-analyzer/svg-objects";
import { Assertion, _throw } from "@music-analyzer/stdlib";
import { CurrentTimeRatio } from "@music-analyzer/view-parameters";
import { SongLength } from "@music-analyzer/view-parameters";
import { ChordGravityMediator, DMelodyMediator, HierarchyLevelMediator, MelodyBeepMediator, MelodyVolumeMediator, ScaleGravityMediator, TimeRangeMediator } from "./UIMediators";
import { AccompanyToAudioRegistry } from "@music-analyzer/view";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { BeatElements, ChordElements, MelodyElements } from "@music-analyzer/piano-roll/src/piano-roll";
import { ControllerUIs } from "./controller-uis";
import { dMelodyController, gravityController, hierarchyLevelController, melodyBeepController, timeRangeController } from "@music-analyzer/controllers";
import { melodyColorController } from "@music-analyzer/controllers/src/melody-color-selector";

const setupAnalysis = (
  beat: BeatElements,
  chord: ChordElements,
  melody: MelodyElements,
) => {
  const analysis_view = {
    svg: document.createElementNS("http://www.w3.org/2000/svg", "g")
  };
  analysis_view.svg.appendChild(beat.beat_bars.svg);
  analysis_view.svg.appendChild(chord.chord_notes.svg);
  analysis_view.svg.appendChild(chord.chord_names.svg);
  analysis_view.svg.appendChild(chord.chord_romans.svg);
  analysis_view.svg.appendChild(chord.chord_keys.svg);
  analysis_view.svg.appendChild(melody.d_melody_collection.svg);
  analysis_view.svg.appendChild(melody.melody_hierarchy.svg);
  analysis_view.svg.appendChild(melody.ir_hierarchy.svg);
  analysis_view.svg.appendChild(melody.chord_gravities.svg);
  analysis_view.svg.appendChild(melody.scale_gravities.svg);
  analysis_view.svg.appendChild(melody.time_span_tree.svg);
  return analysis_view;
};

const setupPianoRoll = (
  beat: BeatElements,
  chord: ChordElements,
  melody: MelodyElements,
  FULL_VIEW: boolean
) => {
  const octave_bgs = document.createElementNS("http://www.w3.org/2000/svg", "g");
  octave_bgs.id = "octave-BGs";
  getOctaveBGs(getWhiteBGs(), getBlackBGs()).svg
    .forEach(e => octave_bgs.appendChild(e.svg));

  const analysis_view = setupAnalysis(beat, chord, melody);
  const octave_keys = document.createElementNS("http://www.w3.org/2000/svg", "g");
  octave_keys.id = "octave-keys";
  getOctaveKeys(getWhiteKeys(), getBlackKeys()).svg
    .forEach(e => octave_keys.appendChild(e.svg));

  const piano_roll_view = new PianoRoll();
  piano_roll_view.svg.appendChild(octave_bgs);
  piano_roll_view.svg.appendChild(analysis_view.svg);
  piano_roll_view.svg.appendChild(octave_keys);
  if (!FULL_VIEW) {
    piano_roll_view.svg.appendChild(getCurrentTimeLine().svg);
  }
  return piano_roll_view;
};

export const setupControllers = (controller: ControllerUIs, NO_CHORD: boolean) => {
  const d_melody = dMelodyController(controller.d_melody_switcher);
  const hierarchy_level = hierarchyLevelController(controller.hierarchy_level);
  const time_length = timeRangeController(controller.time_range_slider);
  const gravity_switcher = gravityController(
    controller.chord_gravity_switcher,
    controller.scale_gravity_switcher
  );
  const melody_beep_controllers = melodyBeepController(
    controller.melody_beep_switcher,
    controller.melody_beep_volume
  );
  const melody_color_selector = melodyColorController(controller.melody_color_selector);

  const controllers = document.createElement("div");
  controllers.id = "controllers";
  controllers.style = "margin-top:20px";
  controllers.appendChild(d_melody);
  controllers.appendChild(hierarchy_level);
  controllers.appendChild(time_length);
  if (!NO_CHORD) {
    controllers.appendChild(gravity_switcher);
  }
  controllers.appendChild(melody_beep_controllers);
  controllers.appendChild(melody_color_selector);  // NOTE: 色選択は未実装なので消しておく
  return controllers;
};


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

  const NO_CHORD = false;  // コード関連のものを表示しない
  const FULL_VIEW = true;  // 横いっぱいに分析結果を表示
  if (FULL_VIEW) {
    CurrentTimeRatio.value = 0.025;
    audio_element.autoplay = false;
  }


  const controller_UIs = new ControllerUIs();
  const last = <T>(arr: T[]) => arr[arr.length - 1];
  const beat = new BeatElements(beat_info, last(hierarchical_melody));
  const chord = new ChordElements(romans);
  const melody = new MelodyElements(hierarchical_melody, d_melodies);

  const d_melody_switcher_mediator = new DMelodyMediator(controller_UIs.d_melody_switcher, melody.d_melody_collection);
  const scale_gravity_switcher_mediator = new ScaleGravityMediator(controller_UIs.scale_gravity_switcher, melody.scale_gravities);
  const chord_gravity_switcher_mediator = new ChordGravityMediator(controller_UIs.chord_gravity_switcher, melody.chord_gravities);
  const hierarchy_level_slider_mediator = new HierarchyLevelMediator(controller_UIs.hierarchy_level, melody.melody_hierarchy, melody.ir_hierarchy, melody.ir_plot, melody.time_span_tree, melody.scale_gravities, melody.chord_gravities);
  const melody_beep_switcher_mediator = new MelodyBeepMediator(controller_UIs.melody_beep_switcher, melody.melody_hierarchy);
  const melody_beep_volume_mediator = new MelodyVolumeMediator(controller_UIs.melody_beep_volume, melody.melody_hierarchy);
  const time_range_slider_mediator = new TimeRangeMediator(controller_UIs.time_range_slider, AccompanyToAudioRegistry.instance);
  const piano_roll_view = setupPianoRoll(beat, chord, melody, FULL_VIEW);

  const controllers = setupControllers(controller_UIs, NO_CHORD);

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
