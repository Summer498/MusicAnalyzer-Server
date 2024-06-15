import { HTML, SVG } from "../../packages/HTML";
import { play } from "../../packages/Synth";
import { _Chord, _Note, _Scale } from "../../packages/TonalObjects";
import { chord_name_margin, chord_text_size, getChordKeysSVG, getChordNamesSVG, getChordNotesSVG, getChordRomansSVG } from "../../packages/chordView";
import { TimeAndRomanAnalysis } from "../../packages/chordToRoman";
import { TimeAndMelodyAnalysis } from "../../packages/melodyAnalyze";
import { calcTempo } from "../../packages/BeatEstimation";
import { getBlackBGs, getBlackKeys, getOctaveBGs, getOctaveKeys, getPianoRollWidth, getWhiteBGs, getWhiteKeys, piano_roll_height, piano_roll_time_length, window_reflectable_registry, updatable_registry, current_time_ratio } from "../../packages/View";
import { beepMelody, chord_gravities, deleteMelody, getArrowSVGs, getDMelodySVG, getIRSymbolSVG, getMelodySVG, insertMelody, key_gravities, refresh_arrow } from "../../packages/melodyView";
import { getBeatBars } from "../../packages/BeatView";

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
console.log(romans);
console.log(melodies);
// const notes = roman[0].chords[1][2].notes;  // 0 個目のコード列の1番目の推定候補の2個目のコードの構成音

const audio_area = document.getElementById("audio_area")!;
const audio: HTMLAudioElement | HTMLVideoElement = (() => {
  const a = audio_area.getElementsByTagName("audio");
  const v = audio_area.getElementsByTagName("video");
  if (a.length > 0) { return a[0]; }
  else { return v[0]; }
})();

// テンポの計算
const beat_info = calcTempo(melodies, romans);
console.log("tempo");
console.log(beat_info.tempo);
console.log("duration");
console.log(audio.duration);
console.log("last melody");
console.log(melodies[melodies.length - 1].end);

let once_refreshed = false;  // activate refresher flag

// ボタン
const slider = HTML.input({ type: "range", id: "slider" });
const show_slider_value = HTML.span({}, slider.value);
const key_gravity_switcher_id = "key-gravity-switcher";
const chord_gravity_switcher_id = "chord-gravity-switcher";
const melody_beep_switcher_id = "melody-sound-switcher";
const key_gravity_switcher = HTML.input_checkbox({ id: key_gravity_switcher_id, name: key_gravity_switcher_id });
const chord_gravity_switcher = HTML.input_checkbox({ id: chord_gravity_switcher_id, name: chord_gravity_switcher_id });
const melody_beep_switcher = HTML.input_checkbox({ id: melody_beep_switcher_id, name: melody_beep_switcher_id });
const melody_beep_volume = HTML.input_range({ id: "melody-volume", min: 0, max: 100, step: 1 });
const show_melody_beep_volume = HTML.span({}, `volume: ${melody_beep_volume.value}`);
slider.addEventListener("input", e => { show_slider_value.textContent = slider.value; });
melody_beep_volume.addEventListener("input", e => { show_melody_beep_volume.textContent = `volume: ${melody_beep_volume.value}`; });
key_gravity_switcher.checked = true;
chord_gravity_switcher.checked = true;
melody_beep_switcher.checked = true;
/*
// NOTE: 色選択は未実装なので消しておく
const melody_color_selector_name = "melody-color-selector";
const key_color_selector = HTML.input_radio({ name: melody_color_selector_name, id: "color-selector-key", value: "key", checked: `${true}` }, "key based color");
const chord_color_selector = HTML.input_radio({ name: melody_color_selector_name, id: "color-selector-chord", value: "chord" }, "chord based color");
const melody_color_selector =
  HTML.div({ display: "inline" }, "", [
    HTML.label({ for: "color-selector-key" }, "key based color"),
    key_color_selector,
    HTML.label({ for: "color-selector-chord" }, "chord based color"),
    chord_color_selector,
  ]);
*/
key_gravity_switcher.addEventListener("click", () => { once_refreshed = false; });
chord_gravity_switcher.addEventListener("click", () => { once_refreshed = false; });

// svg element の作成
const arrow_svgs = getArrowSVGs(melodies);
const melody_svgs = getMelodySVG(melodies);
const IR_svgs = getIRSymbolSVG(melodies);
console.log("IR symbols");
console.log(IR_svgs);
const updatable = [
  getBeatBars(beat_info, melodies),
  getChordNotesSVG(romans),
  getChordNamesSVG(romans),
  getChordRomansSVG(romans),
  getChordKeysSVG(romans),
  getDMelodySVG(d_melodies),
  melody_svgs,
  IR_svgs
];
updatable.forEach(e => updatable_registry.register(e));
const current_time_line = SVG.line({ name: "current_time", "stroke-width": 5, stroke: "#000" });
const piano_roll = SVG.svg({ name: "piano-roll" }, undefined, [
  // 奥側
  SVG.g({ name: "octave-BGs" }, undefined, getOctaveBGs(getWhiteBGs(), getBlackBGs()).svg.map(e => e.svg)),

  updatable.map(e => e.group),

  SVG.g({ name: "gravities" }, undefined, [
    arrow_svgs.map(e => e.line),
    arrow_svgs.map(e => e.triangle)
  ]),

  SVG.g({ name: "octave-keys" }, undefined, getOctaveKeys(getWhiteKeys(), getBlackKeys()).svg.map(e => e.svg)),
  current_time_line,
  // 手前側
].flat());
const piano_roll_place = document.getElementById("piano-roll-place")!;

// 設定
piano_roll_place.appendChildren([
  slider,
  show_slider_value,
  HTML.div({ id: "gravity-switcher" }, "", [
    HTML.span({}, "", [
      HTML.label({ for: key_gravity_switcher_id }, "Key Gravity"),
      key_gravity_switcher,
    ]),
    HTML.span({}, "", [
      HTML.label({ for: chord_gravity_switcher_id }, "Chord Gravity"),
      chord_gravity_switcher,
    ])
  ]),
  HTML.span({}, "", [
    HTML.label({ for: melody_beep_switcher_id }, "Beep Melody"),
    melody_beep_switcher,
    melody_beep_volume,
    show_melody_beep_volume,
  ]),
  // NOTE: 色選択は未実装なので消しておく
  // melody_color_selector,
  piano_roll
]);

let old_time = Date.now();
const fps_element = HTML.p({ name: "fps" }, `fps:${0}`);

let last_audio_time = Number.MIN_SAFE_INTEGER;
const onUpdate = () => {
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

  const piano_roll_width = getPianoRollWidth();
  const current_time_x = piano_roll_width * current_time_ratio;
  const note_size = piano_roll_width / piano_roll_time_length;

  key_gravities.forEach(e => e.setAttribute("visibility", key_gravity_switcher.checked ? "visible" : "hidden"));
  chord_gravities.forEach(e => e.setAttribute("visibility", chord_gravity_switcher.checked ? "visible" : "hidden"));

  updatable_registry.onUpdate(current_time_x, now_at, note_size);
  refresh_arrow(arrow_svgs, current_time_x, now_at, note_size);


  // 音出し
  /* NOTE: うるさいので停止中
  beepBeat(beat_bars, now_at);
  */
  melody_beep_switcher.checked && beepMelody(melody_svgs, now_at, Number(melody_beep_volume.value) / 400);
};


// TODO: refresh を draw のときに呼び出すようにする
// 多分値が最初の時刻を想定した値になっているので直す
const onWindowResized = () => {
  // 各 svg のパラメータを更新する
  const piano_roll_width = getPianoRollWidth();
  window_reflectable_registry.onWindowResized(piano_roll_width);
  piano_roll.setAttributes({ x: 0, y: 0, width: piano_roll_width, height: piano_roll_height + chord_text_size * 2 + chord_name_margin });

  const current_time_x = piano_roll_width * current_time_ratio;
  current_time_line.setAttributes({ x1: current_time_x, x2: current_time_x, y1: 0, y2: piano_roll_height });
  onUpdate();
};



// ---------- main ---------- //
const main = () => {
  const update = () => {
    requestAnimationFrame(update);
    onUpdate();
  };

  window.onresize = e => onWindowResized();
  onWindowResized();
  update();

  0 && (
    document.body.insertAdjacentElement("beforeend", fps_element),
    console.log(beat_info.tempo)
  );
};
main();
