import { AnalyzedDataContainer } from "@music-analyzer/analyzed-data-container"
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { SongLength } from "@music-analyzer/view-parameters";
import { AnalyzedMusicData, getMusicAnalyzerWindow } from "../MusicAnalyzerWindow";
import { setupUI } from "../setup-ui";
import { EventLoop } from "../EventLoop";
import { ApplicationManager } from "../application-manager";
import { HTMLsContainer, TitleInfo } from "../containers";

const setSongLength = (
  hierarchical_melody: TimeAndAnalyzedMelody[][],
) => {
  const last = <T>(arr: T[]) => arr[arr.length - 1];
  const melodies = last(hierarchical_melody);
  SongLength.set(Math.max(...melodies.map(e => e.time.end)) * 1.05); // ちょっとマージンを取っておく
}

export const setup = (
  window: Window,
  html: HTMLsContainer,
  title: TitleInfo,
) => (raw_analyzed_data: AnalyzedMusicData) => {
  const { roman, hierarchical_melody, melody, } = raw_analyzed_data;
  const { beat_info, d_melodies } = new AnalyzedDataContainer(roman, melody, hierarchical_melody)
  setSongLength(hierarchical_melody);
  const manager = new ApplicationManager(beat_info, roman, hierarchical_melody, melody, d_melodies);
  setupUI(title, html, manager);
  new EventLoop(manager.audio_time_mediator, html.audio_player).update();
  getMusicAnalyzerWindow(window, raw_analyzed_data).onresize = _ => manager.window_size_mediator.onUpdate();
  manager.window_size_mediator.onUpdate();
}
