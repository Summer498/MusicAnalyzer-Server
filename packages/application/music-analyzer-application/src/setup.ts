import { AnalyzedMusicData, getMusicAnalyzerWindow } from "./MusicAnalyzerWindow";
import { initializeApplication } from "./initialize-application";
import { setupUI } from "./setup-ui";
import { EventLoop } from "./EventLoop";
import { HTMLsContainer } from "./HTMLs-container";
import { TitleInfo } from "./tune-info";

export const setup = (
  window: Window,
  html: HTMLsContainer,
  title: TitleInfo,
) => (raw_analyzed_data: AnalyzedMusicData) => {
  const e = setupUI(
    `${title.mode}-${title.id}`,
    html.title,
    initializeApplication(raw_analyzed_data),
    html.piano_roll_place,
    html.audio_player,
  );
  new EventLoop(e.audio, html.audio_player).update();
  getMusicAnalyzerWindow(window, raw_analyzed_data).onresize = _ => e.window.onUpdate();
  e.window.onUpdate();
}
