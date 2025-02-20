import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { MusicAnalyzerWindow } from "./src/MusicAnalyzerWindow";
import { updateTitle } from "./src/UIManager";
import { initializeApplication } from "./src/initialize-application";
import { EventLoop } from "./src/EventLoop";

declare const window: MusicAnalyzerWindow;
declare const audio_player: HTMLAudioElement | HTMLVideoElement;
declare const piano_roll_place: HTMLDivElement;
declare const title: HTMLHeadingElement;
type Mode = "TSR" | "PR" | "";

const main = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tune_id = urlParams.get("tune") || "";
  const mode: Mode = urlParams.has("pr") ? "PR" : urlParams.has("tsr") ? "TSR" : "";
  updateTitle(title, tune_id, mode);
  initializeApplication(tune_id, mode, window, piano_roll_place, audio_player)
    .then(e => WindowReflectableRegistry.instance.onWindowResized());
  new EventLoop(AudioReflectableRegistry.instance, audio_player).update();
  window.onresize = e => WindowReflectableRegistry.instance.onWindowResized();
  WindowReflectableRegistry.instance.onWindowResized();
};
main();