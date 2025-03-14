import { AudioViewer } from "@music-analyzer/spectrogram";
import { CurrentTimeLine, OctaveBGs, OctaveKeys, PianoRoll } from "@music-analyzer/svg-objects";
import { CurrentTimeRatio } from "@music-analyzer/view-parameters";
import { getRawSaveButton, getSaveButton } from "./save-button";
import { TitleInfo } from "../containers/tune-info";
import { HTMLsContainer } from "../containers/HTMLs-container";
import { ApplicationManager } from "../application-manager";
import { AnalysisView } from "./setup-analysis";

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
  manager.audio_time_mediator.register(audio_viewer);
  const piano_roll_view = new PianoRoll(
    manager.window_size_mediator, [
    new OctaveBGs(manager.window_size_mediator).svg,
    new AnalysisView(manager.analyzed, [manager.window_size_mediator, manager.audio_time_mediator]).svg,
    new OctaveKeys(manager.window_size_mediator).svg,
    new CurrentTimeLine(!manager.FULL_VIEW, manager.window_size_mediator).svg,
  ]);
  const save_buttons = getSaveButtons(title_info, html, piano_roll_view);

  setChildren(
    html.piano_roll_place,
    [
      audio_viewer.wave.svg,
      audio_viewer.spectrogram.svg,
      save_buttons.with_title,
      save_buttons.raw,
      piano_roll_view.svg,
      html.audio_player,
      new ColumnHTML(
        manager.controller.div,
        manager.analyzed.melody.ir_plot.svg
      ).div,
    ]
  )
};

const setChildren = (
  div: HTMLDivElement,
  children: (HTMLElement | SVGSVGElement)[]
) => {
  children.forEach(e => div.appendChild(e))
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