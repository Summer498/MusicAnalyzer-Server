import { AnalyzedMusicData, getMusicAnalyzerWindow } from "./MusicAnalyzerWindow";
import { setupUI } from "./setup-ui";
import { EventLoop } from "./EventLoop";
import { HTMLsContainer } from "./HTMLs-container";
import { TitleInfo } from "./tune-info";
import { AnalyzedDataContainer } from "./analyzed-data-container";
import { SongLength } from "@music-analyzer/view-parameters";

const setSongLength = (
  analyzed: AnalyzedDataContainer,
) => {
  const { hierarchical_melody } = analyzed;
  const last = <T>(arr: T[]) => arr[arr.length - 1];
  const melodies = last(hierarchical_melody);
  SongLength.set(Math.max(...melodies.map(e => e.time.end)) * 1.05); // ちょっとマージンを取っておく
}

export const setup = (
  window: Window,
  html: HTMLsContainer,
  title: TitleInfo,
) => (raw_analyzed_data: AnalyzedMusicData) => {
  const analyzed = new AnalyzedDataContainer(raw_analyzed_data)
  setSongLength(analyzed);
  const app_manager = setupUI(title, html, analyzed);
  new EventLoop(app_manager.audio_subscriber, html.audio_player).update();
  getMusicAnalyzerWindow(window, raw_analyzed_data).onresize = _ => app_manager.window_subscriber.onUpdate();
  app_manager.window_subscriber.onUpdate();
}
