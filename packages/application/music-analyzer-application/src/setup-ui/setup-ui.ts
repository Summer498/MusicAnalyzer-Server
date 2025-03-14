import { AudioViewer } from "@music-analyzer/spectrogram";
import { PianoRoll } from "@music-analyzer/svg-objects";
import { CurrentTimeRatio } from "@music-analyzer/view-parameters";
import { ApplicationManager } from "../application-manager";
import { HTMLsContainer, TitleInfo } from "../containers";
import { getSaveButtons } from "./save-button";
import { asParent } from "./as-parent";
import { ColumnHTML } from "./column-html";

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
  const piano_roll_view = new PianoRoll(manager)
  asParent(html.piano_roll_place)
    .appendChildren(
      audio_viewer.wave.svg,
      audio_viewer.spectrogram.svg,
      ...getSaveButtons(title_info, html, piano_roll_view),
      piano_roll_view.svg,
      html.audio_player,
      new ColumnHTML(
        manager.controller.div,
        manager.analyzed.melody.ir_plot.svg
      ).div,
    )
};
