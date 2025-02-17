import { Assertion, _throw } from "@music-analyzer/stdlib";
import { CurrentTimeRatio } from "@music-analyzer/view-parameters";
import { SongLength } from "@music-analyzer/view-parameters";
import { ChordGravityMediator, DMelodyMediator, HierarchyLevelMediator, MelodyBeepMediator, MelodyVolumeMediator, ScaleGravityMediator, TimeRangeMediator } from "../UIMediators";
import { AccompanyToAudioRegistry } from "@music-analyzer/view";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { BeatElements, ChordElements, MelodyElements } from "../piano-roll";
import { ControllerUIs } from "../controller-uis";
import { setupPianoRoll } from "./setup-piano-roll";
import { setupControllers } from "./setup-controllers";

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

  const d_melody_switcher_mediator = new DMelodyMediator(controller_UIs.d_melody_controller.checkbox, melody.d_melody_collection);
  const scale_gravity_switcher_mediator = new ScaleGravityMediator(controller_UIs.gravity_controller.scale_checkbox, melody.scale_gravities);
  const chord_gravity_switcher_mediator = new ChordGravityMediator(controller_UIs.gravity_controller.chord_checkbox, melody.chord_gravities);
  const hierarchy_level_slider_mediator = new HierarchyLevelMediator(controller_UIs.hierarchy_controller.slider, melody.melody_hierarchy, melody.ir_hierarchy, melody.ir_plot, melody.time_span_tree, melody.scale_gravities, melody.chord_gravities);
  const melody_beep_switcher_mediator = new MelodyBeepMediator(controller_UIs.melody_beep_controller.checkbox, melody.melody_hierarchy);
  const melody_beep_volume_mediator = new MelodyVolumeMediator(controller_UIs.melody_beep_controller.volume, melody.melody_hierarchy);
  const time_range_slider_mediator = new TimeRangeMediator(controller_UIs.time_range_controller.slider, AccompanyToAudioRegistry.instance);

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
