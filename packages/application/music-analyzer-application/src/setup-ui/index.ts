import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/music-analyzer-application";
import { Assertion, _throw } from "@music-analyzer/stdlib";
import { AudioViewer } from "@music-analyzer/spectrogram";
import { CurrentTimeRatio, SongLength } from "@music-analyzer/view-parameters";
import { getRawSaveButton, getSaveButton } from "./get-save-button";
import { setupPianoRoll } from "./setup-piano-roll";
import { Controllers } from "./setup-controllers";
import { BeatElements, ChordElements, MelodyElements } from "../piano-roll";
import { AnalyzedDataContainer } from "../analyzed-data-container";
import { MediatorsContainer } from "../UIMediators";

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
  audio_subscriber: AudioReflectableRegistry,
  window_subscriber: WindowReflectableRegistry,
) => {
  const { beat_info, romans, hierarchical_melody, d_melodies } = analyzed;
  new Assertion(hierarchical_melody.length > 0).onFailed(() => { throw new Error(`hierarchical melody length must be more than 0 but it is ${hierarchical_melody.length}`); });
  const melodies = hierarchical_melody[hierarchical_melody.length - 1];
  SongLength.value = Math.max(
    ...melodies.map(e => e.time.end)
  ) * 1.05; // ちょっとマージンを取っておく

  const NO_CHORD = false;  // コード関連のものを表示しない
  const FULL_VIEW = true;  // 横いっぱいに分析結果を表示
  if (FULL_VIEW) {
    CurrentTimeRatio.value = 0.025;
    audio_element.autoplay = false;
  } else {
    audio_element.autoplay = true;
  }


  const last = <T>(arr: T[]) => arr[arr.length - 1];
  const beat = new BeatElements(beat_info, last(hierarchical_melody));
  const chord = new ChordElements(romans);
  const melody = new MelodyElements(hierarchical_melody, d_melodies);

  const audio_viewer = new AudioViewer(audio_element);
  audio_subscriber.register(audio_viewer);

  const piano_roll_view = setupPianoRoll(beat, chord, melody, FULL_VIEW, audio_subscriber, window_subscriber);
  const controllers = new Controllers(NO_CHORD);
  new MediatorsContainer(controllers.children, beat, chord, melody, audio_subscriber, window_subscriber);
  const ir_plot = getIRPlot(melody);
  const save_button = getSaveButton(tune_id, title, piano_roll_view);
  const save_raw_button = getRawSaveButton(tune_id, title, piano_roll_view);

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
};
