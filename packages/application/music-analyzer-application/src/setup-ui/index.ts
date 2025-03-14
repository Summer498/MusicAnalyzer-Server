import { AudioViewer } from "@music-analyzer/spectrogram";
import { CurrentTimeLine, OctaveBGs, OctaveKeys, PianoRoll } from "@music-analyzer/svg-objects";
import { CurrentTimeRatio } from "@music-analyzer/view-parameters";
import { getSaveButtons } from "./save-button";
import { TitleInfo } from "../containers/tune-info";
import { HTMLsContainer } from "../containers/HTMLs-container";
import { ApplicationManager } from "../application-manager";
import { AnalysisView } from "./setup-analysis";
import { asParent } from "./as-parent";

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

  const audio_viewer = new AudioViewer(html.audio_player, manager.audio_time_mediator);
  const piano_roll_view = new PianoRoll(
    manager.window_size_mediator, [
    new OctaveBGs(manager.window_size_mediator).svg,
    new AnalysisView(manager.analyzed, [manager.window_size_mediator, manager.audio_time_mediator]).svg,
    new OctaveKeys(manager.window_size_mediator).svg,
    new CurrentTimeLine(!manager.FULL_VIEW, manager.window_size_mediator).svg,
  ]);

  asParent(html.piano_roll_place)
    .setChildren([
      audio_viewer.wave.svg,
      audio_viewer.spectrogram.svg,
      ...getSaveButtons(title_info, html, piano_roll_view),
      piano_roll_view.svg,
      html.audio_player,
      new ColumnHTML(
        manager.controller.div,
        manager.analyzed.melody.ir_plot.svg
      ).div,
    ])
};


class ColumnHTML {
  readonly div: HTMLDivElement
  constructor(...children: (HTMLElement | SVGSVGElement)[]) {
    this.div = document.createElement("div");
    this.div.setAttribute("style", `column-count: ${children.length}`);
    children.forEach(e => this.div.appendChild(e));
  }
}