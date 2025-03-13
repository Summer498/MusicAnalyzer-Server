import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { loadMusicAnalysis, setAudioPlayer } from "./data-loader";
import { AnalyzedMusicData, MusicAnalyzerWindow } from "./MusicAnalyzerWindow";
import { updateTitle } from "./update-title";
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
  urlParams: URLSearchParams,
  audio_src: string,
  audio_player: HTMLAudioElement | HTMLVideoElement,
  piano_roll_place: HTMLDivElement,
  title: HTMLHeadingElement,
  resources: string,
) => {
  type Mode = "TSR" | "PR" | "";
  const tune_id = urlParams.get("tune") || "";
  const mode: Mode = urlParams.has("pr") ? "PR" : urlParams.has("tsr") ? "TSR" : "";
  const audio_subscriber = new AudioReflectableRegistry();
  const window_subscriber = new WindowReflectableRegistry();

  updateTitle(title, tune_id, mode);
  setAudioPlayer(resources, tune_id, audio_src, audio_player);
  loadMusicAnalysis(tune_id, mode)
    .then(raw_analyzed_data => {
      const music_analyzer_window = getMusicAnalyzerWindow(window, raw_analyzed_data);
      const analyzed_data = initializeApplication(raw_analyzed_data);
      setupUI(`${mode}-${tune_id}`, title, analyzed_data, piano_roll_place, audio_player, audio_subscriber, window_subscriber);
      new EventLoop(audio_subscriber, audio_player).update();
      music_analyzer_window.onresize = e => window_subscriber.onUpdate();
      window_subscriber.onUpdate();
    });
}
