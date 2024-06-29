import { HTML } from "@music-analyzer/html";
import { play } from "@music-analyzer/synth";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { calcTempo } from "@music-analyzer/beat-estimation";
import { WindowReflectableRegistry, UpdatableRegistry } from "@music-analyzer/view";
import { getPianoRoll } from "@music-analyzer/svg-objects";
import { controllers, deleteMelody, insertMelody } from "@music-analyzer/melody-view";

interface MusicAnalyzerWindow extends Window {
  MusicAnalyzer: {
    roman: TimeAndRomanAnalysis[],
    melody: TimeAndMelodyAnalysis[]
    insertMelody: typeof insertMelody,
    deleteMelody: typeof deleteMelody,
    play: typeof play
  }
}
declare const window: MusicAnalyzerWindow;
declare const audio_player: HTMLAudioElement | HTMLVideoElement;
declare const piano_roll_place: HTMLDivElement;

/*
TODO: 1. get song name from URL parameter, 2. fetch song↓
const roman = (await (await fetch("../../resources/Hierarchical Analysis Sample/analyzed/chord/roman.json")).json()) as TimeAndRomanAnalysis[];
const melody = (await (await fetch("../../resources/Hierarchical Analysis Sample/analyzed/melody/crepe/manalyze.json")).json()) as TimeAndMelodyAnalysis[];
window.MusicAnalyzer={
  roman,
  melody,
  insertMelody,
  deleteMelody,
  play
};
*/

const d_romans: TimeAndRomanAnalysis[] = window.MusicAnalyzer.roman.map(e => e);
const d_melodies: TimeAndMelodyAnalysis[] = window.MusicAnalyzer.melody.map(e => ({
  begin: e.begin - 0.16,  // ズレ補正
  end: e.end - 0.16,
  melody_analysis: e.melody_analysis,
  note: e.note,
  roman_name: e.roman_name
}));
const romans = d_romans.map(e => e);
const melodies = d_melodies.map(e => e).filter((e, i) => i + 1 >= d_melodies.length || 60 / (d_melodies[i + 1].begin - d_melodies[i].begin) < 300 * 4);

window.MusicAnalyzer.insertMelody = insertMelody;
window.MusicAnalyzer.deleteMelody = deleteMelody;
window.MusicAnalyzer.play = play;  // NOTE:コンソールデバッグ用

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
piano_roll_place.appendChildren([
  controllers,
  getPianoRoll({ beat_info, romans, melodies, d_melodies }).svg[0].svg
]);
// <-- SVG

// メインループ -->

let old_time = Date.now();
const fps_element = HTML.p({ name: "fps" }, `fps:${0}`);

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

  UpdatableRegistry.instance.onUpdate(now_at);
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
