import { AnalyzedMusicData, MusicAnalyzerWindow } from "./MusicAnalyzerWindow";
import { initializeApplication } from "./initialize-application";
import { setupUI } from "./setup-ui";
import { EventLoop } from "./EventLoop";

const getMusicAnalyzerWindow = (window: Window, raw_analyzed_data: AnalyzedMusicData) => {
  const e = window as MusicAnalyzerWindow;
  e.MusicAnalyzer = raw_analyzed_data;
  return e;
}

export const setup = (
  window: Window,
  audio_player: HTMLAudioElement | HTMLVideoElement,
  piano_roll_place: HTMLDivElement,
  title: HTMLHeadingElement,
  mode: string,
  tune_id: string,
) => (raw_analyzed_data: AnalyzedMusicData) => {
  const e = setupUI(
    `${mode}-${tune_id}`,
    title,
    initializeApplication(raw_analyzed_data),
    piano_roll_place,
    audio_player,
  );
  new EventLoop(e.audio, audio_player).update();
  getMusicAnalyzerWindow(window, raw_analyzed_data).onresize = _ => e.window.onUpdate();
  e.window.onUpdate();
}
