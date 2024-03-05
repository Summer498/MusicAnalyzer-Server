import { HTML, SVG } from "../../packages/HTML";
import { play } from "../../packages/Synth";
import { _Chord, _Note, _Scale } from "../../packages/TonalObjects";
import { chord_text_size, getChordKeysSVG, getChordNamesSVG, getChordNotesSVG, getChordRomansSVG } from "../../packages/chordView";
import { search_items_begins_in_range } from "../../packages/timeAnd";
import { TimeAndRomanAnalysis } from "../../packages/chordToRoman";
import { TimeAndMelodyAnalysis } from "../../packages/melodyAnalyze";
import { black_bgs_prm, getBlackBGs, getBlackKeys, getOctaveBGs, getOctaveKeys, getPianoRollWidth, getWhiteBGs, getWhiteKeys, piano_roll_height, piano_roll_time_length, white_bgs_prm, } from "../../packages/View";
import { getArrowSVG, getDMelodySVG, getMelodySVG, refresh_arrow } from "../../packages/melodyView";
import { calcTempo } from "../../packages/BeatEstimation";
import { getBeatBars } from "../../packages/BeatView";

const debug_mode = true;
const debug_log_element = HTML.p({ name: "debug" });
if (debug_mode) {
  document.body.insertAdjacentElement("afterbegin", debug_log_element);
}

interface MusicAnalyzerWindow extends Window {
  MusicAnalyzer: { roman: TimeAndRomanAnalysis[], melody: TimeAndMelodyAnalysis[] }
  play: typeof play
}
declare const window: MusicAnalyzerWindow;

const detected_romans: TimeAndRomanAnalysis[] = window.MusicAnalyzer.roman.map(e => e);
const detected_melodies: TimeAndMelodyAnalysis[] = window.MusicAnalyzer.melody.map(e => e);
const romans = detected_romans.map(e => e);
const melodies = detected_melodies.map(e => e).filter((e, i) => i + 1 >= detected_melodies.length || 60 / (detected_melodies[i + 1].begin - detected_melodies[i].begin) < 300 * 4);

window.play = play;  // NOTE:コンソールデバッグ用
console.log(romans);
console.log(melodies);
// const notes = roman[0].chords[1][2].notes;  // 0 個目のコード列の1番目の推定候補の2個目のコードの構成音

// テンポの計算

const beat_info = calcTempo(melodies, romans);

const audio_area = document.getElementById("audio_area")!;
const audio: HTMLAudioElement | HTMLVideoElement = (() => {
  const a = audio_area.getElementsByTagName("audio");
  const v = audio_area.getElementsByTagName("video");
  if (a.length > 0) { return a[0]; }
  else { return v[0]; }
})();

// svg element の作成

console.log("tempo");
console.log(beat_info.tempo);
console.log("duration");
console.log(audio.duration);
console.log("last melody");
console.log(melodies[melodies.length - 1].end);
const beat_bars = getBeatBars(beat_info, melodies);
const chord_rects = getChordNotesSVG(romans);
const chord_names = getChordNamesSVG(romans);
const chord_romans = getChordRomansSVG(romans);
const chord_keys = getChordKeysSVG(romans);
const d_melody_svgs = getDMelodySVG(detected_melodies);
const melody_svgs = getMelodySVG(melodies);
const arrow_svgs = getArrowSVG(melodies);
const white_BGs = getWhiteBGs();
const black_BGs = getBlackBGs();
const white_key = getWhiteKeys();
const black_key = getBlackKeys();
const octave_BGs = getOctaveBGs(white_BGs, black_BGs);
const octave_key = getOctaveKeys(white_key, black_key);
const current_time_line = SVG.line({ name: "current_time", "stroke-width": 5, stroke: "#000" });
const piano_roll = SVG.svg({ name: "piano-roll" }, undefined, [
  // 奥側
  SVG.g({ name: "octave-BGs" }, undefined, octave_BGs.map(e => e.svg)),

  beat_bars.group,

  chord_rects.group,
  chord_names.group,
  chord_romans.group,
  chord_keys.group,

  /*d_melody_svgs.group,*/
  melody_svgs.group,

  SVG.g({ name: "gravities" }, undefined, [
    arrow_svgs.map(e => e.line),
    arrow_svgs.map(e => e.triangle)
  ]),

  SVG.g({ name: "octave-keys" }, undefined, octave_key.map(e => e.svg)),
  current_time_line,
  // 手前側
]);
const piano_roll_place = document.getElementById("piano-roll-place");
piano_roll_place?.insertAdjacentElement("afterbegin", piano_roll);

const insertMelody = () => {
  console.log("insert melody");
};

const deleteMelody = () => {
  console.log("delete melody");
};

let old_time = Date.now();
const fps_element = HTML.p({ name: "fps" }, `fps:${0}`);

let once_refreshed = false;
let last_audio_time = Number.MIN_SAFE_INTEGER;
const refresh = () => {
  const now = Date.now();
  const fps = Math.floor(1000 / (now - old_time));
  fps_element.textContent = `fps:${(" " + fps).slice(-3)} ${fps < 60 ? '<' : '>'} 60`;
  old_time = now;
  const now_at = audio.currentTime;
  // TODO: 止めたときの挙動がおかしいので直す
  // 大量の計算を行った後のアニメーションの挙動はちょっとおかしくなるらしい
  if (audio.paused && now_at === last_audio_time) {
    if (once_refreshed) { return; }
    else { once_refreshed = true; }
  } else { once_refreshed = false; }
  last_audio_time = now_at;

  const current_time_ratio = 1 / 4;
  const current_time_x = getPianoRollWidth() * current_time_ratio;
  const piano_roll_width = getPianoRollWidth();
  const note_size = piano_roll_width / piano_roll_time_length;

  [chord_rects, chord_names, chord_romans, chord_keys, beat_bars, d_melody_svgs, melody_svgs].forEach(e => {
    e.updateShow(now_at - piano_roll_time_length * current_time_ratio, now_at + piano_roll_time_length);
    e.update(current_time_x, now_at, note_size);
  });
  refresh_arrow(arrow_svgs, note_size, current_time_x, now_at * note_size);


  // 音出し
  /* NOTE: うるさいので停止中
  beepBeat(beat_bars, now_at);
  beepMelody(melody_svgs, now_at);
  */
};


// TODO: refresh を draw のときに呼び出すようにする
// 多分値が最初の時刻を想定した値になっているので直す
const draw = () => {
  // 各 svg のパラメータを更新する
  const piano_roll_width = getPianoRollWidth();
  const current_time_x = piano_roll_width / 4;
  const chord_name_margin = 5;

  white_bgs_prm.width = piano_roll_width;
  black_bgs_prm.width = piano_roll_width;
  black_key.forEach(e => e.svg.setAttributes({ x: 0, y: e.y, width: e.width, height: e.height }));
  white_key.forEach(e => e.svg.setAttributes({ x: 0, y: e.y, width: e.width, height: e.height }));
  black_BGs.forEach(e => e.svg.setAttributes({ x: 0, y: e.y, width: piano_roll_width, height: e.height }));
  white_BGs.forEach(e => e.svg.setAttributes({ x: 0, y: e.y, width: piano_roll_width, height: e.height }));
  octave_BGs.forEach(e => e.svg.setAttributes({ x: 0, y: e.y, width: piano_roll_width, height: e.height }));
  octave_key.forEach(e => e.svg.setAttributes({ x: 0, y: e.y, width: piano_roll_width, height: e.height }));
  piano_roll.setAttributes({ x: 0, y: 0, width: piano_roll_width, height: piano_roll_height + chord_text_size * 2 + chord_name_margin });

  current_time_line.setAttributes({ x1: current_time_x, x2: current_time_x, y1: 0, y2: piano_roll_height });
  refresh();
};



// ---------- main ---------- //
const main = () => {
  console.log(search_items_begins_in_range(melodies, 30, 90));
  // audio.addEventListener("timeupdate", refresh);

  const update = () => {
    requestAnimationFrame(update);
    refresh();
  };

  window.onresize = e => draw();
  draw();
  update();

  0 && (
    document.body.insertAdjacentElement("beforeend", fps_element),
    console.log(beat_info.tempo)
  );
};
main();
