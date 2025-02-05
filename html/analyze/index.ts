import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { calcTempo } from "@music-analyzer/beat-estimation";
import { WindowReflectableRegistry, AccompanyToAudioRegistry } from "@music-analyzer/view";
import { appendController, appendPianoRoll } from "./src/song-manager";
import { NowAt } from "@music-analyzer/view-parameters";
import { SongManager } from "@music-analyzer/piano-roll";

interface MusicAnalyzerWindow extends Window {
  readonly MusicAnalyzer: {
    readonly roman: TimeAndRomanAnalysis[],
    readonly melody: IMelodyModel[]
  }
}
declare const window: MusicAnalyzerWindow;
declare const audio_player: HTMLAudioElement | HTMLVideoElement;
declare const piano_roll_place: HTMLDivElement;

/*
TODO: 1. get song name from URL parameter, 2. fetch song↓
const roman = (await (await fetch("../../resources/Hierarchical Analysis Sample/analyzed/chord/roman.json")).json()) as TimeAndRomanAnalysis[];
const melody = (await (await fetch("../../resources/Hierarchical Analysis Sample/analyzed/melody/crepe/manalyze.json")).json()) as IMelodyModel[];
window.MusicAnalyzer={
  roman,
  melody,
};
*/

const d_romans: TimeAndRomanAnalysis[] = window.MusicAnalyzer.roman.map(e => e);
const d_melodies: IMelodyModel[] = window.MusicAnalyzer.melody.map(e => ({
  ...e,
  begin: e.begin - 0.16,  // ズレ補正
  end: e.end - 0.16,
}));
const romans = d_romans.map(e => e);
const melodies = d_melodies.map(e => e).filter((e, i) => i + 1 >= d_melodies.length || 60 / (d_melodies[i + 1].begin - d_melodies[i].begin) < 300 * 4);

// テンポの計算
const beat_info = calcTempo(melodies, romans);
/*
console.log("tempo");
console.log(beat_info.tempo);
console.log("duration");
console.log(audio_player.duration);
console.log("last melody");
console.log(melodies[melodies.length - 1].end);
*/


// SVG -->
const song_manager = new SongManager(beat_info, romans, [melodies], d_melodies);
// song_manager.analysis_data = { beat_info, romans, hierarchical_melody: [melodies], d_melodies };
const piano_roll = appendPianoRoll(piano_roll_place, song_manager);
appendController(piano_roll_place, piano_roll);
// <-- SVG

// メインループ -->

let old_time = Date.now();
const fps_element = document.createElement("p");
fps_element.id = "fps";
fps_element.textContent = `fps:${0}`;

let last_audio_time = Number.MIN_SAFE_INTEGER;
const onUpdate = () => {
  // fps 関連処理 -->
  const now = Date.now();
  const fps = Math.floor(1000 / (now - old_time));
  fps_element.textContent = `fps:${(" " + fps).slice(-3)} ${fps < 60 ? '<' : '>'} 60`;
  old_time = now;
  // <-- fps 関連処理

  // --> audio 関連処理
  const now_at = audio_player.currentTime;
  // TODO: 止めたときの挙動がおかしいので直す
  // 大量の計算を行った後のアニメーションの挙動はちょっとおかしくなるらしい
  if (audio_player.paused && now_at === last_audio_time) { return; }
  last_audio_time = now_at;
  // <-- audio 関連処理

  NowAt.value = now_at;
  AccompanyToAudioRegistry.instance.onAudioUpdate();
};


// TODO: refresh を draw のときに呼び出すようにする
// 多分値が最初の時刻を想定した値になっているので直す
const onWindowResized = () => {
  // 各 svg のパラメータを更新する
  WindowReflectableRegistry.instance.onWindowResized();
  onUpdate();
};

// ---------- main ---------- //
const main = () => {
  const update = () => {
    onUpdate();
    requestAnimationFrame(update);
  };

  window.onresize = e => onWindowResized();
  onWindowResized();
  update();

  document.body.insertAdjacentElement("beforeend", fps_element);
  0 && console.log(beat_info.tempo);
};
main();
