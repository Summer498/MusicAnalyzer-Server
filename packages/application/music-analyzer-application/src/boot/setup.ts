import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { SongLength } from "@music-analyzer/view-parameters";
import { AnalyzedMusicData, getMusicAnalyzerWindow } from "../MusicAnalyzerWindow";
import { setupUI } from "../setup-ui";
import { EventLoop } from "../EventLoop";
import { ApplicationManager } from "../application-manager";
import { AnalyzedDataContainer, HTMLsContainer, TitleInfo } from "../containers";

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
  const { beat_info, romans, hierarchical_melody, melodies, d_melodies } = new AnalyzedDataContainer(raw_analyzed_data)
  setSongLength(hierarchical_melody);
  const manager = new ApplicationManager(beat_info, romans, hierarchical_melody, melodies, d_melodies);
  setupUI(title, html, manager);
  new EventLoop(manager.audio_time_mediator, html.audio_player).update();
  getMusicAnalyzerWindow(window, raw_analyzed_data).onresize = _ => manager.window_size_mediator.onUpdate();
  manager.window_size_mediator.onUpdate();
}
