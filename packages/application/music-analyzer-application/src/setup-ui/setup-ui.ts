import { AudioViewer } from "./facade";
import { PianoRoll } from "./facade";
import { CurrentTimeRatio } from "./facade";
import { ApplicationManager } from "./facade";
import { HTMLsContainer } from "./facade";
import { TitleInfo } from "./facade";
import { getSaveButtons } from "./save-button/get-save-buttons";
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
