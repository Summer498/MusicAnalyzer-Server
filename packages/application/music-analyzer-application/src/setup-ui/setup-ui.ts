import { getSaveButtons } from "./save-button";
import { asParent } from "./as-parent";
import { ColumnHTML } from "./column-html";
import { HTMLsContainer } from "../containers";
import { TitleInfo } from "../containers";
import { ApplicationManager } from "../application-manager";
import { CurrentTimeRatio } from "@music-analyzer/view-parameters";
import { AudioViewer } from "@music-analyzer/spectrogram";
import { PianoRoll } from "@music-analyzer/piano-roll";

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
  const piano_roll_view = new PianoRoll(manager.analyzed, manager.window_size_mediator, !manager.FULL_VIEW)
  asParent(html.piano_roll_place)
    .appendChildren(
      new ColumnHTML(
        audio_viewer.wave.svg,
        audio_viewer.spectrogram.svg,
        audio_viewer.fft.svg,
      ).div,
      ...getSaveButtons(title_info, html, piano_roll_view),
      piano_roll_view.svg,
      html.audio_player,
      new ColumnHTML(
        manager.controller.div,
        manager.analyzed.melody.ir_plot_svg.svg
      ).div,
    )
};
