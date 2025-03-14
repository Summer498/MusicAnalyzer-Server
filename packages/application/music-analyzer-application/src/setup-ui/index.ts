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
import { TitleInfo } from "../tune-info";
import { HTMLsContainer } from "../HTMLs-container";
import { PianoRoll } from "@music-analyzer/svg-objects";

const getIRPlot = (melody: MelodyElements) => {
  const ir_plot = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  ir_plot.appendChild(melody.ir_plot.svg);
  ir_plot.id = "IR-plot";
  ir_plot.setAttribute("width", String(melody.ir_plot.width));
  ir_plot.setAttribute("height", String(melody.ir_plot.height));
  return ir_plot;
};

export const setupUI = (
  title_info: TitleInfo,
  html: HTMLsContainer,
  analyzed: AnalyzedDataContainer,
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
    html.audio_player.autoplay = false;
  }
  else { html.audio_player.autoplay = true; }

  const music_structure = new MusicStructureElements(
    new BeatElements(beat_info, melodies),
    new ChordElements(romans),
    new MelodyElements(hierarchical_melody, d_melodies),
  )

  const audio_viewer = new AudioViewer(html.audio_player);
  const controllers = new Controllers(NO_CHORD);
  const reflectors = jointModelAndView(controllers.children, music_structure);
  reflectors.audio.register(audio_viewer);
  const piano_roll_view = setupPianoRoll(FULL_VIEW, music_structure, reflectors);
  const save_buttons = getSaveButtons(title_info, html, piano_roll_view);
  const bottom = createBottom(controllers, getIRPlot(music_structure.melody));

  setPianoRollPlace(
    html.piano_roll_place,
    audio_viewer.wave.svg,
    audio_viewer.spectrogram.svg,
    save_buttons.with_title,
    save_buttons.raw,
    piano_roll_view.svg,
    html.audio_player,
    bottom,
  )

  return reflectors
};

const setPianoRollPlace = (
  piano_roll_place: HTMLDivElement,
  ...children: (HTMLElement | SVGSVGElement)[]
) => {
  children.forEach(e => piano_roll_place.appendChild(e))
}

class SaveButtons {
  constructor(
    readonly with_title: HTMLInputElement,
    readonly raw: HTMLInputElement,
  ) { }
}

const getSaveButtons = (
  title: TitleInfo,
  html: HTMLsContainer,
  piano_roll_view: PianoRoll,
) => {
  const tune_id = `${title.mode}-${title.id}`;
  return new SaveButtons(
    getSaveButton(tune_id, html.title, piano_roll_view),
    getRawSaveButton(tune_id, html.title, piano_roll_view),
  )
}

const createBottom = (
  controllers: Controllers,
  ir_plot: SVGSVGElement,
) => {
  const bottom = document.createElement("div");
  bottom.setAttribute("style", `column-count: ${2}`);
  bottom.appendChild(controllers.div);
  bottom.appendChild(ir_plot);
  return bottom
}
