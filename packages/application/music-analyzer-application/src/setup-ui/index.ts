import { AudioViewer } from "@music-analyzer/spectrogram";
import { CurrentTimeRatio } from "@music-analyzer/view-parameters";
import { getRawSaveButton, getSaveButton } from "./save-button";
import { setupPianoRoll } from "./setup-piano-roll";
import { MelodyElements } from "../piano-roll";
import { TitleInfo } from "../tune-info";
import { HTMLsContainer } from "../HTMLs-container";
import { PianoRoll } from "@music-analyzer/svg-objects";
import { ApplicationManager } from "../application-manager";

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
  manager: ApplicationManager,
) => {
  if (manager.FULL_VIEW) {
    CurrentTimeRatio.set(0.025);
    html.audio_player.autoplay = false;
  }
  else { html.audio_player.autoplay = true; }

  const audio_viewer = new AudioViewer(html.audio_player);
  manager.audio_subscriber.register(audio_viewer);
  const piano_roll_view = setupPianoRoll(manager.FULL_VIEW, manager.analyzed, manager);
  const save_buttons = getSaveButtons(title_info, html, piano_roll_view);
  const bottom = new ColumnHTML(manager.controller.div, getIRPlot(manager.analyzed.melody))

  setPianoRollPlace(
    html.piano_roll_place,
    audio_viewer.wave.svg,
    audio_viewer.spectrogram.svg,
    save_buttons.with_title,
    save_buttons.raw,
    piano_roll_view.svg,
    html.audio_player,
    bottom.div,
  )
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

class ColumnHTML {
  readonly div: HTMLDivElement
  constructor(...children: (HTMLElement | SVGSVGElement)[]) {
    this.div = document.createElement("div");
    this.div.setAttribute("style", `column-count: ${children.length}`);
    children.forEach(e => this.div.appendChild(e));
  }
}