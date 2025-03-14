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
  const reflector = setupUI(title, html, initializeApplication(raw_analyzed_data));
  new EventLoop(reflector.audio, html.audio_player).update();
  getMusicAnalyzerWindow(window, raw_analyzed_data).onresize = _ => reflector.window.onUpdate();
  reflector.window.onUpdate();
}
