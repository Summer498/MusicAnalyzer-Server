import { AudioReflectableRegistry, EventLoop, initializeApplication, loadMusicAnalysis, MusicAnalyzerWindow, setAudioPlayer, setupUI, WindowReflectableRegistry } from "@music-analyzer/music-analyzer-application";
import { updateTitle } from "./src/update-title";

declare const window: MusicAnalyzerWindow;
declare const audio_player: HTMLAudioElement | HTMLVideoElement;
declare const piano_roll_place: HTMLDivElement;
declare const title: HTMLHeadingElement;
type Mode = "TSR" | "PR" | "";

const resources = `/MusicAnalyzer-server/resources`;
const audio_src = `${resources}/Hierarchical Analysis Sample/sample1.mp4`;

const main = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tune_id = urlParams.get("tune") || "";
  const mode: Mode = urlParams.has("pr") ? "PR" : urlParams.has("tsr") ? "TSR" : "";
  const audio_subscriber = new AudioReflectableRegistry();
  const window_subscriber = new WindowReflectableRegistry();
  updateTitle(title, tune_id, mode);
  setAudioPlayer(resources, tune_id, audio_src, audio_player);
  loadMusicAnalysis(tune_id, mode)
    .then(raw_analyzed_data => {
      window.MusicAnalyzer = raw_analyzed_data;
      const analyzed_data = initializeApplication(raw_analyzed_data);
      setupUI(`${mode}-${tune_id}`, title, analyzed_data, piano_roll_place, audio_player, audio_subscriber, window_subscriber);
      new EventLoop(audio_subscriber, audio_player).update();
      window.onresize = e => window_subscriber.onUpdate();
      window_subscriber.onUpdate();
    });
};
main();