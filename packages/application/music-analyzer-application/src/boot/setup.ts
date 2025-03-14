import { AnalyzedMusicData, getMusicAnalyzerWindow } from "../MusicAnalyzerWindow";
import { setupUI } from "../setup-ui";
import { EventLoop } from "../EventLoop";
import { SongLength } from "@music-analyzer/view-parameters";
import { ApplicationManager } from "../application-manager";
import { AnalyzedDataContainer, HTMLsContainer, TitleInfo } from "../containers";

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
  new EventLoop(manager.audio_time_mediator, html.audio_player).update();
  getMusicAnalyzerWindow(window, raw_analyzed_data).onresize = _ => manager.window_size_mediator.onUpdate();
  manager.window_size_mediator.onUpdate();
}
