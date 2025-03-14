import { AnalyzedMusicData, getMusicAnalyzerWindow } from "../MusicAnalyzerWindow";
import { setupUI } from "../setup-ui";
import { EventLoop } from "../EventLoop";
import { HTMLsContainer } from "../containers/HTMLs-container";
import { TitleInfo } from "../containers/tune-info";
import { AnalyzedDataContainer } from "../containers/analyzed-data-container";
import { SongLength } from "@music-analyzer/view-parameters";
import { ApplicationManager } from "../application-manager";

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
  const manager = new ApplicationManager(analyzed);
  setupUI(title, html, manager);
  new EventLoop(manager.audio_subscriber, html.audio_player).update();
  getMusicAnalyzerWindow(window, raw_analyzed_data).onresize = _ => manager.window_subscriber.onUpdate();
  manager.window_subscriber.onUpdate();
}
