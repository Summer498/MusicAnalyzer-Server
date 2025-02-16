import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { calcTempo } from "@music-analyzer/beat-estimation";
import { bracket_hight, NowAt, PianoRollBegin, PianoRollEnd } from "@music-analyzer/view-parameters";
import { SongManager } from "@music-analyzer/piano-roll";
import { setupUI } from "./src/song-manager";
import { MusicAnalyzerWindow } from "./src/MusicAnalyzerWindow";
import { loadMusicAnalysis } from "./src/MusicAnalysisLoader";
import { updateTitle } from "./src/UIManager";
import { AccompanyToAudioRegistry, WindowReflectableRegistry } from "@music-analyzer/view";


declare const window: MusicAnalyzerWindow;
declare const audio_player: HTMLAudioElement | HTMLVideoElement;
declare const piano_roll_place: HTMLDivElement;
declare const controllers: HTMLDivElement;
declare const title: HTMLHeadingElement;
type Mode = "TSR" | "PR" | "";

const initializeApplication = async (tune_id: string, mode: Mode) => {
  window.MusicAnalyzer = await loadMusicAnalysis(tune_id, mode);

  const d_romans: TimeAndRomanAnalysis[] = window.MusicAnalyzer.roman.map(e => e);
  const d_melodies: IMelodyModel[] = window.MusicAnalyzer.melody.map(e => ({
    ...e
  }));
  const romans = d_romans.map(e => e);
  const melodies = d_melodies.map(e => e)
    .filter((e, i) => i + 1 >= d_melodies.length || 60 / (d_melodies[i + 1].begin - d_melodies[i].begin) < 300 * 4);

  // テンポの計算
  const beat_info = calcTempo(melodies, romans);

  // SVG -->
  const highest_pitch = window.MusicAnalyzer.melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note > c.note ? p : c).note || 0;
  const lowest_pitch = window.MusicAnalyzer.melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note < c.note ? p : c).note || 0;
  PianoRollBegin.value = highest_pitch + Math.floor(window.MusicAnalyzer.hierarchical_melody.length * bracket_hight / 12) * 12 + 12;
  PianoRollEnd.value = lowest_pitch - 3;
  const song_manager = new SongManager(beat_info, romans, window.MusicAnalyzer.hierarchical_melody, d_melodies);
  setupUI(song_manager, piano_roll_place, controllers);
};

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
  await initializeApplication(tune_id, mode);
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