import { NowAt } from "@music-analyzer/view-parameters";
import { MusicAnalyzerWindow } from "./src/MusicAnalyzerWindow";
import { updateTitle } from "./src/UIManager";
import { AccompanyToAudioRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { initializeApplication } from "./src/initialize-application";


declare const window: MusicAnalyzerWindow;
declare const audio_player: HTMLAudioElement | HTMLVideoElement;
declare const piano_roll_place: HTMLDivElement;
declare const controllers: HTMLDivElement;
declare const title: HTMLHeadingElement;
type Mode = "TSR" | "PR" | "";

const setupFPSMonitor = () => {
  const fps_element = document.createElement("p");
  fps_element.id = "fps";
  fps_element.textContent = `fps:${0}`;
  document.body.insertAdjacentElement("beforeend", fps_element);
  return fps_element;
};

let last_audio_time = Number.MIN_SAFE_INTEGER;
const audioUpdate = (accompany_to_audio_registry: AccompanyToAudioRegistry) => {
  // --> audio 関連処理
  const now_at = audio_player.currentTime;
  if (audio_player.paused && now_at === last_audio_time) { return; }
  last_audio_time = now_at;
  NowAt.value = now_at;
  accompany_to_audio_registry.onAudioUpdate();
  // <-- audio 関連処理
};

let old_time = Date.now();
const onUpdate = (accompany_to_audio_registry: AccompanyToAudioRegistry, fps_element: HTMLParagraphElement) => {
  // fps 関連処理 -->
  const now = Date.now();
  const fps = Math.floor(1000 / (now - old_time));
  fps_element.textContent = `fps:${(" " + fps).slice(-3)}`;
  fps_element.style.color = fps < 30 ? "red" : fps < 60 ? "yellow" : "lime";
  old_time = now;

  audioUpdate(accompany_to_audio_registry);
};

const main = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tune_id = urlParams.get("tune") || "";
  const mode: Mode = urlParams.has("pr") ? "PR" : urlParams.has("tsr") ? "TSR" : "";
  await initializeApplication(tune_id, mode, window, piano_roll_place, controllers);
  const fps_monitor = setupFPSMonitor();
  updateTitle(title, tune_id, mode);

  const update = () => {
    onUpdate(AccompanyToAudioRegistry.instance, fps_monitor);
    requestAnimationFrame(update);
  };

  window.onresize = e => WindowReflectableRegistry.instance.onWindowResized();
  WindowReflectableRegistry.instance.onWindowResized();
  update();
};
window.onload = main;