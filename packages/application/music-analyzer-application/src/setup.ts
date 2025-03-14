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
  const app_manager = setupUI(title, html, initializeApplication(raw_analyzed_data));
  new EventLoop(app_manager.audio, html.audio_player).update();
  getMusicAnalyzerWindow(window, raw_analyzed_data).onresize = _ => app_manager.window.onUpdate();
  app_manager.window.onUpdate();
}
