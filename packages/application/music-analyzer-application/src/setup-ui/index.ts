import { Assertion, _throw } from "@music-analyzer/stdlib";
import { AudioViewer } from "@music-analyzer/spectrogram";
import { CurrentTimeRatio, SongLength } from "@music-analyzer/view-parameters";
import { getRawSaveButton, getSaveButton } from "./save-button";
import { setupPianoRoll } from "./setup-piano-roll";
import { Controllers } from "./setup-controllers";
import { BeatElements, ChordElements, MelodyElements, MusicStructureElements } from "../piano-roll";
import { AnalyzedDataContainer } from "../analyzed-data-container";
import { jointModelAndView } from "../UIMediators";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";

const getIRPlot = (melody: MelodyElements) => {
  const ir_plot = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  ir_plot.appendChild(melody.ir_plot.svg);
  ir_plot.id = "IR-plot";
  ir_plot.setAttribute("width", String(melody.ir_plot.width));
  ir_plot.setAttribute("height", String(melody.ir_plot.height));
  return ir_plot;
};

export const setupUI = (
  tune_id: string,
  title: HTMLHeadElement,
  analyzed: AnalyzedDataContainer,
  place: HTMLDivElement,
  audio_element: HTMLAudioElement | HTMLVideoElement,
) => {
  const { beat_info, romans, hierarchical_melody, d_melodies } = analyzed;
  new Assertion(hierarchical_melody.length > 0).onFailed(() => { throw new Error(`hierarchical melody length must be more than 0 but it is ${hierarchical_melody.length}`); });
  const last = <T>(arr: T[]) => arr[arr.length - 1];
  const melodies = last(hierarchical_melody);
  SongLength.set(Math.max(...melodies.map(e => e.time.end)) * 1.05); // ちょっとマージンを取っておく

  const NO_CHORD = false;  // コード関連のものを表示しない
  const FULL_VIEW = true;  // 横いっぱいに分析結果を表示
  if (FULL_VIEW) {
    CurrentTimeRatio.set(0.025);
    audio_element.autoplay = false;
  }
  else { audio_element.autoplay = true; }

  const music_structure = new MusicStructureElements(
    new BeatElements(beat_info, melodies),
    new ChordElements(romans),
    new MelodyElements(hierarchical_melody, d_melodies),
  )

  const audio_viewer = new AudioViewer(audio_element);
  
  const controllers = new Controllers(NO_CHORD);
  const subscribers = jointModelAndView(controllers.children, music_structure);
  subscribers.audio.register(audio_viewer);
  const piano_roll_view = setupPianoRoll(FULL_VIEW, music_structure, subscribers);
  const save_button = getSaveButton(tune_id, title, piano_roll_view);
  const save_raw_button = getRawSaveButton(tune_id, title, piano_roll_view);

  const ir_plot = getIRPlot(music_structure.melody);

  const bottom = document.createElement("div");
  bottom.appendChild(controllers.div);
  bottom.appendChild(ir_plot);
  bottom.setAttribute("style", `column-count: ${2}`);
  place.appendChild(audio_viewer.wave.svg);
  place.appendChild(audio_viewer.spectrogram.svg);
  place.appendChild(save_button);
  place.appendChild(save_raw_button);
  place.appendChild(piano_roll_view.svg);
  place.appendChild(audio_element);
  place.appendChild(bottom);

  return subscribers
};
