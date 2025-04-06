import { AnalyzedDataContainer } from "@music-analyzer/analyzed-data-container";
import { setCurrentTimeRatio, setPianoRollParameters } from "@music-analyzer/view-parameters";
import { HTMLsContainer } from "../containers";
import { TitleInfo } from "../containers";
import { AnalyzedMusicData } from "../MusicAnalyzerWindow";
import { getMusicAnalyzerWindow } from "../MusicAnalyzerWindow";
import { ApplicationManager } from "../application-manager";
import { setupUI } from "../setup-ui";
import { EventLoop } from "../EventLoop";

const setFullView = (
  FULL_VIEW: boolean,
  html: HTMLsContainer,
) => {
  if (FULL_VIEW) {
    setCurrentTimeRatio(0.025);
    html.audio_player.autoplay = false;
  }
  else { html.audio_player.autoplay = true; }
}

export const setup = (
  window: Window,
  html: HTMLsContainer,
  title: TitleInfo,
) => (raw_analyzed_data: AnalyzedMusicData) => {
  const { roman, hierarchical_melody, melody, } = raw_analyzed_data;
  const { beat_info, d_melodies } = new AnalyzedDataContainer(roman, melody, hierarchical_melody)
  setPianoRollParameters(hierarchical_melody);
  const manager = new ApplicationManager(beat_info, roman, hierarchical_melody, melody, d_melodies);
  setFullView(manager.FULL_VIEW, html);

  setupUI(title, html, manager);
  new EventLoop(manager.audio_time_mediator, html.audio_player).update();
  getMusicAnalyzerWindow(window, raw_analyzed_data).onresize = _ => manager.window_size_mediator.onUpdate();
  manager.window_size_mediator.onUpdate();
}
