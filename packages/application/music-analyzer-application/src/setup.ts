import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { AnalyzedMusicData, MusicAnalyzerWindow } from "./MusicAnalyzerWindow";
import { initializeApplication } from "./initialize-application";
import { setupUI } from "./setup-ui";
import { EventLoop } from "./EventLoop";

const getMusicAnalyzerWindow = (window: Window, raw_analyzed_data: AnalyzedMusicData) => {
  const hoge = window as MusicAnalyzerWindow;
  hoge.MusicAnalyzer = raw_analyzed_data;
  return window as MusicAnalyzerWindow;
}

export const setup = (
  window: Window,
  audio_player: HTMLAudioElement | HTMLVideoElement,
  piano_roll_place: HTMLDivElement,
  title: HTMLHeadingElement,
  mode: string,
  tune_id: string,
) => (raw_analyzed_data: AnalyzedMusicData) => {
  const audio_subscriber = new AudioReflectableRegistry();
  const window_subscriber = new WindowReflectableRegistry();
  setupUI(
    `${mode}-${tune_id}`,
    title,
    initializeApplication(raw_analyzed_data),
    piano_roll_place,
    audio_player,
    audio_subscriber,
    window_subscriber
  );
  new EventLoop(audio_subscriber, audio_player).update();
  getMusicAnalyzerWindow(window, raw_analyzed_data).onresize = e => window_subscriber.onUpdate();
  window_subscriber.onUpdate();
}
