import { HTML, SVG } from "../../packages/HTML";
import { vMod, getRange, vAdd, mod, decimal, argmax, getZeros, totalSum, correlation } from "../../packages/Math";
import { hsv2rgb, rgbToString } from "../../packages/Color";
import { play } from "../../packages/Synth";
import { _Chord, _Note, _Scale } from "../../packages/TonalObjects";
import { fifthToColor, shorten_chord, shorten_key } from "../../packages/chordView";
import { search_items_overlaps_range, search_items_begins_in_range, TimeAnd } from "../../packages/timeAnd";
import { TimeAndRomanAnalysis } from "../../packages/chordToRoman";
import { TimeAndMelodyAnalysis } from "../../packages/melodyAnalyze";

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
const calcTempo = () => {
  const melody_bpm: number[] = [];
  const bpm_range = 90;
  const onsets = getZeros(Math.ceil(melodies[melodies.length - 1].end * 100));
  const melody_phase: number[][] = getRange(0, 90).map(i => getZeros(90 + i));  // [bpm][phase]
  const b = Math.log2(90);  // 90 ~ 180
  melodies.forEach((e, i) => {
    if (i + 1 >= melodies.length) { return; }
    const term = melodies[i + 1].begin - melodies[i].begin + (Math.random() - 0.5) / 100;
    if (60 / term > 300 * 4) { return; }
    const bpm2 = Math.round(Math.pow(2, decimal(Math.log2(60 / term) - b) + b));
    const bpm = Math.round(Math.pow(3, decimal(Math.log2(bpm2) / Math.log2(3) - b / Math.log2(3)) + b / Math.log2(3)));
    if (isNaN(melody_bpm[bpm])) { melody_bpm[bpm] = 0; }
    melody_bpm[bpm]++;

    // ビートを求める方法その2 (考え中)
    getRange(0, bpm_range).forEach(bpm => {
      melody_phase[bpm][Math.floor(mod(e.begin, bpm + 90))]++;
    });
    // ビートを求める方法その3 (採用中 & 考え中)
    onsets[Math.floor(e.begin * 100)] = 1;
  });
  console.log("melody_bpm");
  console.log(melody_bpm);

  // ビートを求める方法その2 (考え中)
  const entropy = melody_phase.map(e => {
    const sum = totalSum(e);
    const prob = e.map(e => e / sum);
    return totalSum(prob.map(p => p === 0 ? 0 : -p * Math.log2(p)));
  });
  console.log(melody_phase);
  console.log("bpm_entropy");
  console.log(entropy);

  // ビートを求める方法その3 (採用中 & 考え中)
  onsets.forEach((e, i) => e === 0 && i !== 0 && (onsets[i] = onsets[i - 1] * 0.9));  // オンセット時に最大値, 時間経過で減衰する信号を作る
  const w = (tau: number) => {
    const tau_0 = 50;  // 0.5 * 100
    const sigma_tau = 2;
    const x = Math.log2(tau / tau_0) / sigma_tau;
    return Math.exp(-x * x / 2);
  };
  console.log("onsets");
  console.log(onsets);
  const tps = correlation(onsets, onsets).map((e, tau) => w(tau) * e[0]);
  console.log("tempo period strength");
  console.log(tps);
  console.log(argmax(tps));
  console.log(tps.map((e, i) => [e, i]).sort((p, c) => p[0] > c[0] ? -1 : p[0] === c[0] ? 0 : 1));

  // NOTE: 未使用
  const roman_bpm: number[] = [];
  romans.forEach((_, i) => {
    if (i + 1 >= romans.length) { return; }
    const term = romans[i + 1].begin - romans[i].begin;
    const bpm2 = Math.round(Math.pow(2, decimal(Math.log2(60 / term) - b) + b));
    const bpm = Math.round(Math.pow(3, decimal(Math.log2(bpm2) / Math.log2(3) - b / Math.log2(3)) + b / Math.log2(3)));
    if (isNaN(roman_bpm[bpm])) { roman_bpm[bpm] = 0; }
    roman_bpm[bpm]++;
  });
  console.log("roman_bpm");
  console.log(roman_bpm);
  return argmax(tps);
};
const tempo = calcTempo();
const phase = 0;

const audio_area = document.getElementById("audio_area")!;
const audio: HTMLAudioElement | HTMLVideoElement = (() => {
  const a = audio_area.getElementsByTagName("audio");
  const v = audio_area.getElementsByTagName("video");
  if (a.length > 0) { return a[0]; }
  else { return v[0]; }
})();

class RectParameters {
  width: number;
  height: number;
  fill: string;
  stroke: string;
  constructor(args: { width: number, height: number, fill: string, stroke: string }) {
    this.width = args.width;
    this.height = args.height;
    this.fill = args.fill;
    this.stroke = args.stroke;
  }
}

// --- ピアノロールの描画パラメータ
const size = 2;
const getPianoRollWidth = () => window.innerWidth - 48;  // innerWidth が動的に変化する
const octave_height = size * 84;  // 7 白鍵と 12 半音をきれいに描画するには 7 * 12 の倍数が良い
const octave_cnt = 3;
const piano_roll_begin = 83;
const white_key_prm = new RectParameters({ width: 36, height: octave_height / 7, fill: "#fff", stroke: "#000", });
const black_key_prm = new RectParameters({ width: white_key_prm.width * 2 / 3, height: octave_height / 12, fill: "#444", stroke: "#000", });
const white_bgs_prm = new RectParameters({ width: getPianoRollWidth(), height: octave_height / 12, fill: "#eee", stroke: "#000", });
const black_bgs_prm = new RectParameters({ width: getPianoRollWidth(), height: octave_height / 12, fill: "#ccc", stroke: "#000", });

const piano_roll_height = octave_height * octave_cnt;
const black_position = vMod(vAdd([2, 4, 6, 9, 11], piano_roll_begin), 12);
const white_position = getRange(0, 12).filter(e => !black_position.includes(e));
const chord_text_em = size;
const chord_text_size = 16 * chord_text_em;
const piano_roll_time_length = 5;  // 1 画面に収める曲の長さ[秒]
const chord_name_margin = 5;

const triangle_width = 5;
const triangle_height = 5;


interface TimeAndSVGs<T extends SVGElement> extends TimeAnd { svg: T; }

class SvgWindow<T extends SVGElement, U extends TimeAndSVGs<T>> {
  readonly all: U[];
  readonly show: U[];
  readonly group: SVGGElement;
  constructor(name: string, all: U[]) {
    this.all = all;
    this.show = [];//all.map(e => e);
    this.group = SVG.g({ name }, undefined, this.show.map(e => e.svg));
  }
  updateShow(begin: number, end: number) {
    // const remain = search_items_in_range(this.show, begin, end);
    // this.show.splice(0, remain.begin_index).forEach(e=>this.group.removeChild(e.svg));  // 左側にはみ出したものを消す
    // this.show.splice(remain.end_index, this.show.length - remain.end_index).forEach(e=>this.group.removeChild(e.svg));  // 右側にはみ出したものを消す
    this.show.splice(0, this.show.length);  // 全部消す
    this.group.childNodes.forEach(e => this.group.removeChild(e));  // 全部消す
    const append = search_items_overlaps_range(this.all, begin, end);
    this.all.slice(append.begin_index, append.end_index).forEach(e => { this.show.push(e); this.group.appendChild(e.svg); });  // 必要分全部追加する
  }
}

// svg element の作成
const chord_rects = new SvgWindow("chords",
  romans.map(e => {
    const chord = _Chord.get(e.chord);
    return getRange(0, octave_cnt).map(oct => chord.notes.map(note => ({
      svg: SVG.rect({ fill: fifthToColor(chord.tonic!, 0.5, chord.type === "major" ? 0.9: 0.7), stroke: "#444" }),
      begin: e.begin,
      end: e.end,
      y: (-1 - mod(_Note.chroma(note), 12) + 12 * (oct + 1)) * black_key_prm.height,
      w: e.end - e.begin,
      h: black_key_prm.height
    })));
  }).flat(2)
);
const chord_names = new SvgWindow("chord-names", romans.map(e => ({
  svg: SVG.text({ id: "chord-name", "font-family": 'Times New Roman', "font-size": `${chord_text_em}em`, fill: fifthToColor(_Chord.get(e.chord).tonic!, 1, 0.75) || "#000" }, shorten_chord(_Chord.get(e.chord).name)),
  begin: e.begin,
  end: e.end,
  y: piano_roll_height + chord_text_size
})));
const chord_romans = new SvgWindow("roman-names", romans.map(e => ({
  svg: SVG.text({ id: "roman-name", "font-family": 'Times New Roman', "font-size": `${chord_text_em}em`, fill: fifthToColor(_Chord.get(e.chord).tonic!, 1, 0.75) || "#000" }, shorten_chord(e.roman)),
  begin: e.begin,
  end: e.end,
  y: piano_roll_height + chord_text_size * 2 + chord_name_margin
})));
const chord_keys = new SvgWindow("key-names", romans.map(e => ({
  svg: SVG.text({ id: "key-name", "font-family": "Times New Roman", "font-size": `${chord_text_em}em`, "text-anchor": "end", fill: fifthToColor(_Scale.get(e.scale).tonic!, 1, 0.75) || "#000" }, shorten_key(_Scale.get(e.scale)) + ': '),
  begin: e.begin,
  end: e.end,
  y: piano_roll_height + chord_text_size * 2 + chord_name_margin
})));

console.log("tempo");
console.log(tempo);
console.log("duration");
console.log(audio.duration);
console.log("last melody");
console.log(melodies[melodies.length - 1].end);
const beat_bars = new SvgWindow("beat-bars",
  getRange(0, Math.ceil(tempo * melodies[melodies.length - 1].end) + phase).map(i => ({
    svg: SVG.line({ id: "bar", stroke: "#000" }),
    begin: i * 60 / tempo,
    end: (i + 1) * 60 / tempo,
    y1: 0,
    y2: piano_roll_height,
    sound_reserved: false
  }))
);

const d_melody_svgs = new SvgWindow("detected-melody",
  detected_melodies.map(e => ({
    svg: SVG.rect({ name: "melody-note", fill: rgbToString(hsv2rgb(0, 0, 0.75)), stroke: "#444" }),
    begin: e.begin,
    end: e.end,
    note: e.note,
    y: (piano_roll_begin - e.note) * black_key_prm.height,
    w: e.end - e.begin,
    h: black_key_prm.height
  }))
);

const melody_svgs = new SvgWindow("melody",
  melodies.map(e => ({
    svg: SVG.rect({ name: "melody-note", fill: rgbToString(hsv2rgb(180 + 360 * 2 / 7, 0.5, 0.9)), stroke: "#444" }),
    begin: e.begin,
    end: e.end,
    note: e.note,
    y: (piano_roll_begin - e.note) * black_key_prm.height,
    w: e.end - e.begin,
    h: black_key_prm.height,
    sound_reserved: false,
  }))
);
const arrow_svgs = melodies.map((e, i) => {
  const stroke = rgbToString([0, 0, 0]);
  const next = melodies.length <= i + 1 ? melodies[i] : melodies[i + 1];
  const fill = rgbToString([0, 0, 0]);
  // let fill = rgbToString(hsv2rgb(180 + 360 * 2 / 7, 0.5, 0.9));
  // if (i === 1 && e.roman_name !== undefined) { fill = romanToColor(e.roman_name, 0.5, 0.9) }
  return e.melody_analysis.gravity.filter(g => g.resolved && g.destination !== undefined).map(gravity => ({
    triangle: SVG.polygon({ name: "gravity-arrow", stroke, fill, "stroke-width": 5 }),
    line: SVG.line({ name: "gravity-arrow", stroke, "stroke-width": 5 }),
    begin: e.begin,
    end: e.end,
    note: e.note,
    next,
    destination: gravity.destination,
    src_x0: (e.end - e.begin) / 2 + e.begin,
    dst_x0: next.begin,
    src_y0: (piano_roll_begin + 0.5 - e.note) * black_key_prm.height,
    dst_y0: (piano_roll_begin + 0.5 - gravity.destination!) * black_key_prm.height,
  }));
}).flat(2);


const white_BGs = [...Array(octave_cnt)].map((_, oct) =>
  [...Array(7)].map((_, j) => ({
    svg: SVG.rect({ name: "white-BG", fill: white_bgs_prm.fill, stroke: white_bgs_prm.stroke, }),
    oct,
    y: octave_height * oct + white_bgs_prm.height * white_position[j],
    width: white_bgs_prm.width,
    height: white_bgs_prm.height
  }))
).flat();
const black_BGs = [...Array(octave_cnt)].map((_, oct) =>
  [...Array(5)].map((_, j) => ({
    svg: SVG.rect({ name: "black-BG", fill: black_bgs_prm.fill, stroke: black_bgs_prm.stroke, }),
    oct,
    y: octave_height * oct + black_bgs_prm.height * black_position[j],
    width: black_bgs_prm.width,
    height: black_bgs_prm.height
  }))
).flat();
const white_key = [...Array(octave_cnt)].map((_, oct) =>
  [...Array(7)].map((_, j) => ({
    svg: SVG.rect({ name: "white-key", fill: white_key_prm.fill, stroke: white_key_prm.stroke, }),
    oct,
    y: octave_height * oct + white_key_prm.height * [0, 1, 2, 3, 4, 5, 6][j],
    width: white_key_prm.width,
    height: white_key_prm.height
  }))
).flat();
const black_key = [...Array(octave_cnt)].map((_, oct) =>
  [...Array(5)].map((_, j) => ({
    svg: SVG.rect({ name: "black-key", fill: black_key_prm.fill, stroke: black_key_prm.stroke, }),
    oct,
    y: octave_height * oct + black_key_prm.height * black_position[j],
    width: black_key_prm.width,
    height: black_key_prm.height
  }))
).flat();

const octave_BGs = [...Array(octave_cnt)].map((_, oct) => ({
  y: octave_height * oct,
  height: octave_height,
  oct,
  svg: SVG.g({ name: "octave-BG" }, undefined, [
    white_BGs.filter(e => e.oct === oct).map(e => e.svg),
    black_BGs.filter(e => e.oct === oct).map(e => e.svg)
  ])
}));
const octave_key = [...Array(octave_cnt)].map((_, oct) => ({
  y: octave_height * oct,
  height: octave_height,
  oct,
  svg: SVG.g({ name: "octave-key" }, undefined, [
    white_key.filter(e => e.oct === oct).map(e => e.svg),
    black_key.filter(e => e.oct === oct).map(e => e.svg)
  ])
}));
const current_time_line = SVG.line({ name: "current_time", "stroke-width": 5, stroke: "#000" });
const piano_roll = SVG.svg({ name: "piano-roll" }, undefined, [
  // 奥側
  SVG.g({ name: "octave-BGs" }, undefined, octave_BGs.map(e => e.svg)),

  beat_bars.group,

  chord_rects.group,
  chord_names.group,
  chord_romans.group,
  chord_keys.group,

  d_melody_svgs.group,
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

type ArrowSVGs = typeof arrow_svgs;
const refresh_arrow = (arrow_svgs: ArrowSVGs, note_size: number, current_time_x: number, std_pos: number) => arrow_svgs.forEach(e => {
  const src_x = e.src_x0 * note_size - std_pos + current_time_x;
  const dst_x = e.dst_x0 * note_size - std_pos + current_time_x;
  const src_y = e.src_y0;
  const dst_y = e.dst_y0;

  const dx = dst_x - src_x;
  const dy = dst_y - src_y;
  const r = Math.sqrt(dx * dx + dy * dy);
  const cos = -dy / r;
  const sin = dx / r;
  const p = [
    dst_x,
    dst_y,
    dst_x + cos * triangle_width - sin * triangle_height,
    dst_y + sin * triangle_width + cos * triangle_height,
    dst_x + cos * -triangle_width - sin * triangle_height,
    dst_y + sin * -triangle_width + cos * triangle_height
  ];
  e.triangle.setAttributes({ points: `${p.join(",")}` });
  e.line.setAttributes({ x1: src_x, x2: dst_x, y1: src_y, y2: dst_y });
});

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
  if (audio.paused && now_at === last_audio_time) {
    if (once_refreshed) { return; }
    else { once_refreshed = true; }
  } else { once_refreshed = false; }
  last_audio_time = now_at;

  const current_time_ratio = 1 / 4;
  const current_time_x = getPianoRollWidth() * current_time_ratio;
  const piano_roll_width = getPianoRollWidth();
  const note_size = piano_roll_width / piano_roll_time_length;

  [chord_rects, chord_names, chord_romans, chord_keys, beat_bars, d_melody_svgs, melody_svgs].forEach(e => e.updateShow(now_at - piano_roll_time_length * current_time_ratio, now_at + piano_roll_time_length));
  chord_rects.show.forEach(e => e.svg.setAttributes({ x: current_time_x + (e.begin - now_at) * note_size, y: e.y, width: e.w * note_size, height: e.h, }));
  chord_names.show.forEach(e => e.svg.setAttributes({ x: current_time_x + (e.begin - now_at) * note_size, y: e.y }));
  chord_romans.show.forEach(e => e.svg.setAttributes({ x: current_time_x + (e.begin - now_at) * note_size, y: e.y }));
  chord_keys.show.forEach(e => e.svg.setAttributes({ x: current_time_x + (e.begin - now_at) * note_size, y: e.y }));
  beat_bars.show.forEach(e => e.svg.setAttributes({ x1: current_time_x + (e.begin - now_at) * note_size, x2: current_time_x + (e.begin - now_at) * note_size, y1: e.y1, y2: e.y2 }));
  d_melody_svgs.show.forEach(e => e.svg.setAttributes({ x: current_time_x + (e.begin - now_at) * note_size, y: e.y, width: e.w * note_size, height: e.h, onclick: "insertMelody()", }));
  melody_svgs.show.forEach(e => e.svg.setAttributes({ x: current_time_x + (e.begin - now_at) * note_size, y: e.y, width: e.w * note_size, height: e.h, onclick: "deleteMelody()", }));
  refresh_arrow(arrow_svgs, note_size, current_time_x, now_at * note_size);

  const reservation_range = 1 / 15;  // second

  // 音出し
  const beat_range = search_items_begins_in_range(beat_bars.show, now_at, now_at + reservation_range);
  for (let i = beat_range.begin_index; i < beat_range.end_index; i++) {
    const e = beat_bars.show[i];
    if (e.sound_reserved === false) {
      play([220], e.begin - now_at, 0.125);
      e.sound_reserved = true;
      setTimeout(() => { e.sound_reserved = false; }, reservation_range * 1000);
    }
  }

  const melody_range = search_items_begins_in_range(melody_svgs.show, now_at, now_at + reservation_range);
  for (let i = melody_range.begin_index; i < melody_range.end_index; i++) {
    const e = melody_svgs.show[i];
    if (e.sound_reserved === false) {
      play([440 * Math.pow(2, (e.note - 69) / 12)], e.begin - now_at, e.end - e.begin);
      e.sound_reserved = true;
      setTimeout(() => { e.sound_reserved = false; }, reservation_range * 1000);
    }
  }
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

  1 && (
    document.body.insertAdjacentElement("beforeend", fps_element),
    console.log(tempo)
  );
};
main();
