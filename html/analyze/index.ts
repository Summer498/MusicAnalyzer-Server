import { HTML, SVG } from "../../packages/HTML/index";
import { vMod, getRange, vAdd, Math, mod } from "../../packages/Math/index";
import { RomanChord } from "../../packages/TonalEx/index";
import { hsv2rgb, rgbToString } from "../../packages/Color/index";
import { play } from "../../packages/Synth/index";
import { Assertion } from "../../packages/StdLib/index";
import { Scale as _Scale } from "tonal";
type Scale = ReturnType<typeof _Scale.get>;

const debug_mode = true;
const debug_log_element = HTML.p({ name: "debug" });
if (debug_mode) {
  document.body.insertAdjacentElement("afterbegin", debug_log_element);
}

type timeAndRoman = { time: number[], progression: RomanChord };
type timeAndMelody = { time: number[], note: number }
type MelodyAnalysis = {
  gravity: {
    destination: number | undefined,
    resolved: boolean,
  }[]
}
type timeAndMelodyAnalysis = {
  time: number[],
  note: number,
  roman_name: string | undefined,
  melodyAnalysis: MelodyAnalysis,
  sound_reserved: boolean;
}

interface MusicAnalyzerWindow extends Window {
  MusicAnalyzer: { roman: timeAndRoman[], melody: timeAndMelodyAnalysis[] }
  play: typeof play
}
declare const window: MusicAnalyzerWindow;

const detected_romans = window.MusicAnalyzer.roman;
const detected_melodies = window.MusicAnalyzer.melody;
const romans = window.MusicAnalyzer.roman.map(e => e);
const melodies = window.MusicAnalyzer.melody.map(e => {
  e.sound_reserved = false;
  return e;
});

window.play = play;
console.log(romans);
console.log(melodies);

// const notes = roman[0].chords[1][2].notes;  // 0 個目のコード列の1番目の推定候補の2個目のコードの構成音

const max = (a: number, b: number) => a > b ? a : b;

// 指定区間の melody の探索
// begin を含み, end をギリギリ含まない下界 (lower bound) の探索
// TODO:境界値がどうなっているのかをテストする
const search_melody_in_range = (melodies: timeAndMelodyAnalysis[], begin: number, end: number) => {
  // Require: melodies は時間昇順にソート済み
  let bl = 0;
  let el = 0;
  let br = melodies.length;
  let er = melodies.length;

  while (bl !== br - 1 && el !== er - 1) {
    const bm = Math.ceil((bl + br - 1) / 2);
    const em = Math.ceil((el + er - 1) / 2);
    const b_time = melodies[bm].time;
    const e_time = melodies[em].time;
    if (b_time[0] < begin) {
      bl = bm
    } else {
      br = bm
    }
    if (e_time[1] < end) {
      el = em
    } else {
      er = em
    }
  }

  new Assertion(bl < er);

  return { begin_index: bl, end_index: er };
}


// WARNING: この方法ではオクターブの差を見ることはできない
// バックエンドから送られてくる Roman がオクターブの差を吸収しているため, オクターブの差を見るには, そちらも要修正
// autoChord で符号化している時点で差が吸収されている & TonalEx 回りでもオクターブの差を無いものとして扱っている(?)
const noteToChroma = (note: string) => {
  const base = max("A1BC2D3EF4G5".indexOf(note[0]), "a1bc2d3ef4g5".indexOf(note[0]));
  const acc = note.length > 1 ? "b♮#".indexOf(note[1]) - 1 : 0;
  return base + acc;
};

const audio_area = document.getElementById("audio_area")!;
const audio: HTMLAudioElement | HTMLVideoElement
  = (() => {
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
  constructor(args: { width: number, height: number, fill: string, stroke: string, }) {
    this.width = args.width;
    this.height = args.height;
    this.fill = args.fill;
    this.stroke = args.stroke;
  }
}

// --- ピアノロールの描画
const octave_height = 3 * 84;  // 7 白鍵と 12 半音をきれいに描画するには 7 * 12 の倍数が良い (多分)
const octave_cnt = 3;
const piano_roll_begin = 83;
const white_key = new RectParameters({ width: 36, height: octave_height / 7, fill: "#fff", stroke: "#000", });
const white_bg_fill = "#eee";
const white_bg_stroke = "#000";
const black_key = new RectParameters({ width: white_key.width * 2 / 3, height: octave_height / 12, fill: "#444", stroke: "#000", });
const black_bg_fill = "#ccc";
const black_bg_stroke = "#000";
const getPianoRollWidth = () => window.innerWidth - 48;

const piano_roll_height = octave_height * octave_cnt;
const black_position = vMod(vAdd([2, 4, 6, 9, 11], piano_roll_begin), 12);
const white_position = getRange(0, 12).filter(e => !black_position.includes(e));
const chord_text_em = 4;
const chord_text_size = 16 * chord_text_em;
const key_text_pos = -chord_text_size * 3;
const piano_roll_time = 5;  // 1 画面に収める曲の長さ[秒]

const triangle_width = 5;
const triangle_height = 0.25;

// コードを表す部分を作成
const romanToColor = (roman: string, s: number, v: number) => {
  let i: number | undefined = undefined;
  const ROMAN = roman.toUpperCase();
  if (0) { }
  else if (ROMAN.includes("VII")) { i = 6; }
  else if (ROMAN.includes("VI")) { i = 3; }
  else if (ROMAN.includes("IV")) { i = 4; }  // IV は V より先に検知しておく
  else if (ROMAN.includes("V")) { i = 0; }
  else if (ROMAN.includes("III")) { i = 1; }
  else if (ROMAN.includes("II")) { i = 5; }
  else if (ROMAN.includes("I")) { i = 2; }
  if (i === undefined) { console.log("888", roman); return "#000000"; }
  const col = hsv2rgb(360 * i / 7, s, v);
  return rgbToString(col);
};

const c_dur = "C1D2EF3G4A5B";
const alt = "b♮#";
const green_hue = 120;  // 0:red, 120:green, 240:blue
const chordToColor = (tonic: string, s: number, v: number) => {
  if (tonic.length === 0) { return "#444"; }
  const _chroma = c_dur.indexOf(tonic[0]);
  const chroma = tonic.length === 1 ? _chroma : _chroma + alt.indexOf(tonic[1]) - 1;
  const col = hsv2rgb(360 * chroma / 12 + green_hue, s, v);
  return rgbToString(col);
};

const shorten_chord = (chord: string) => {
  const M7 = chord.replace("major seventh", "M7");
  const major = M7.replace("major", "");
  const minor = major.replace("minor ", "m").replace("minor", "m");
  const seventh = minor.replace("seventh", "7");
  return seventh;
};

const shorten_key = (key: Scale) => {
  const tonic = key.tonic;
  const type = key.type;
  "aeolian";
  "major";
  if (type === "aeolian") { return `${tonic?.toLowerCase()}-moll`; }
  else if (type === "major") { return `${tonic?.toUpperCase()}-dur`; }
  else { return key.name; }
};

// svg element の作成
const chord_svgs =
  Math.getRange(0, octave_cnt).map(oct =>
    romans.map(time_and_roman => {
      const notes = time_and_roman.progression.chord.notes;
      const chord = time_and_roman.progression.chord;
      const roman = time_and_roman.progression.roman;
      const scale = time_and_roman.progression.scale;
      return {
        rects: notes.map(note => SVG.rect({ name: "chord-note", fill: chordToColor(chord.tonic!, 0.5, 0.9), stroke: "#444" })),
        chord: SVG.text({ id: "chord-name", "font-family": 'Times New Roman', "font-size": `${chord_text_em}em`, fill: chordToColor(chord.tonic!, 1, 0.75) }, shorten_chord(chord.name)),
        roman: SVG.text({ id: "roman-name", "font-family": 'Times New Roman', "font-size": `${chord_text_em}em`, fill: chordToColor(chord.tonic!, 1, 0.75) }, shorten_chord(roman)),
        key: SVG.text({ id: "key-name", "font-family": 'Times New Roman', "font-size": `${chord_text_em}em`, fill: scale.tonic ? chordToColor(scale.tonic, 1, 0.75) : "#000" }, shorten_key(scale)),
        time: time_and_roman.time,
        notes,
        oct
      };
    })
  ).flat(1);

const detected_melody_svgs = detected_melodies.map((e) => {
  return {
    rect: SVG.rect({ name: "melody-note", fill: rgbToString(hsv2rgb(0, 0, 0.5)), stroke: "#444" }),
    time: e.time,
    note: e.note,
  };
});

const melody_svgs = melodies.map((e) => {
  return {
    rect: SVG.rect({ name: "melody-note", fill: rgbToString(hsv2rgb(180 + 360 * 2 / 7, 0.5, 0.9)), stroke: "#444" }),
    time: e.time,
    note: e.note,
  };
});

const arrow_svgs =
  (() => {
    const ret: {
      triangle: SVGPolygonElement,
      line: SVGLineElement,
      time: number[],
      note: number,
      next: timeAndMelodyAnalysis,
      destination: number
    }[] = [];

    const stroke = rgbToString([0, 0, 0]);
    melodies.forEach((e, i) => {
      const next = melodies.length <= i + 1 ? melodies[i] : melodies[i + 1];
      const fill = rgbToString([0, 0, 0]);
      // let fill = rgbToString(hsv2rgb(180 + 360 * 2 / 7, 0.5, 0.9));
      e.melodyAnalysis.gravity.forEach((gravity, j) => {
        // if (i === 1 && e.roman_name !== undefined) { fill = romanToColor(e.roman_name, 0.5, 0.9) }
        if (gravity.resolved && gravity.destination !== undefined) {
          ret.push({
            triangle: SVG.polygon({ name: "gravity-arrow", stroke, fill, "stroke-width": 5 }),
            line: SVG.line({ name: "gravity-arrow", stroke, "stroke-width": 5 }),
            time: e.time,
            note: e.note,
            next,
            destination: gravity.destination
          });
        }
      });
    });
    return ret;
  })();

const white_BGs = [...Array(octave_cnt)].map(i => [...Array(7)].map(j => SVG.rect({ name: "white-BG", fill: white_bg_fill, stroke: white_bg_stroke, })));
const black_BGs = [...Array(octave_cnt)].map(i => [...Array(5)].map(j => SVG.rect({ name: "black-BG", fill: black_bg_fill, stroke: black_bg_stroke, })));
const white_keys = [...Array(octave_cnt)].map(i => [...Array(7)].map(j => SVG.rect({ name: "white-key", fill: white_key.fill, stroke: white_key.stroke, })));
const black_keys = [...Array(octave_cnt)].map(i => [...Array(5)].map(j => SVG.rect({ name: "black-key", fill: black_key.fill, stroke: black_key.stroke, })));
const current_time_line = SVG.line({ name: "current_time", "stroke-width": 5, stroke: "#000" });

const chord_rects = chord_svgs.flatMap(e => e.rects);
const chord_names = chord_svgs.map(e => e.chord);
const roman_names = chord_svgs.map(e => e.roman);
const key_names = chord_svgs.map(e => e.key);
const detected_melody_rects = detected_melody_svgs.map(e => e.rect);
const melody_rects = melody_svgs.map(e => e.rect);
const gravity_arrow_lines = arrow_svgs.map(e => e.line);
const gravity_arrow_triangles = arrow_svgs.map(e => e.triangle);
const octave_BG = [...Array(octave_cnt)].map((_, i) => SVG.g({ name: "octave-BG" }, undefined, [white_BGs[i], black_BGs[i]]));
const octave_keys = [...Array(octave_cnt)].map((_, i) => SVG.g({ name: "octave-keys" }, undefined, [white_keys[i], black_keys[i]]));
const piano_roll = SVG.svg({ name: "piano-roll" }, undefined, [octave_BG, chord_rects, chord_names, roman_names, key_names, detected_melody_rects, melody_rects, gravity_arrow_lines, gravity_arrow_triangles, octave_keys, current_time_line]);
const piano_roll_place = document.getElementById("piano-roll-place");
piano_roll_place?.insertAdjacentElement("afterbegin", piano_roll);

const insertMelody = () => {
  console.log("insert melody");
};

const deleteMelody = () => {
  console.log("delete melody");
};

type ArrowSVGs = typeof arrow_svgs;

const refresh_arrow = (arrow_svgs: ArrowSVGs, note_size: number, current_time_x: number, std_pos: number) => {
  arrow_svgs.forEach((e, i) => {
    if (arrow_svgs.length <= i + 1) { return; }
    const next = e.next;
    const center = (e.time[1] - e.time[0]) / 2;
    const src_x = (center + e.time[0]) * note_size + current_time_x - std_pos;
    const dst_x = next.time[0] * note_size + current_time_x - std_pos;
    const src_y = (piano_roll_begin + 0.5 - e.note) * black_key.height;
    const dst_y = (piano_roll_begin + 0.5 - e.destination) * black_key.height;
    const theta = Math.atan2(dst_y - src_y, dst_x - src_x) + Math.PI / 2;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const w = 5; triangle_width;
    const h = 5; -black_key.height * triangle_height;
    e.line.setAttributes({
      x1: src_x,
      x2: dst_x,
      y1: src_y,
      y2: dst_y
    });
    const tri_pos = [
      dst_x,
      dst_y,
      dst_x + cos * w - sin * h,
      dst_y + sin * w + cos * h,
      dst_x + cos * -w - sin * h,
      dst_y + sin * -w + cos * h
    ];
    e.triangle.setAttributes({
      points: `${tri_pos[0]},${tri_pos[1]},${tri_pos[2]},${tri_pos[3]},${tri_pos[4]},${tri_pos[5]}`
    });
  });
};



const current_time_x = getPianoRollWidth() / 4;//white_key.width + 10;
// TODO: refresh を draw のときに呼び出すようにする
// 多分値が最初の時刻を想定した値になっているので直す
const draw = (piano_roll_width: number) => {
  // 各 svg のパラメータを更新する
  const note_size = piano_roll_width / piano_roll_time;
  const std_pos = audio.currentTime * note_size;
  chord_svgs.forEach(e => e.rects.forEach((rect, i) => rect.setAttributes({
    x: e.time[0] * note_size,
    y: (2 - (mod(noteToChroma(e.notes[i]) - 3, 12) + 3) + 12 * (octave_cnt - e.oct)) * black_key.height,
    width: (e.time[1] - e.time[0]) * note_size,
    height: black_key.height,
  })));
  detected_melody_svgs.forEach(e => e.rect.setAttributes({
    x: e.time[0] * note_size,
    y: (piano_roll_begin - e.note) * black_key.height,
    width: (e.time[1] - e.time[0]) * note_size,
    height: black_key.height,
    onclick: "insertMelody()",
  }));
  melody_svgs.forEach(e => e.rect.setAttributes({
    x: e.time[0] * note_size,
    y: (piano_roll_begin - e.note) * black_key.height,
    width: (e.time[1] - e.time[0]) * note_size,
    height: black_key.height,
    onclick: "deleteMelody()",
  }));
  refresh_arrow(arrow_svgs, note_size, current_time_x, std_pos);

  const chord_name_margin = 5;
  chord_svgs.forEach(e => e.chord.setAttributes({ x: current_time_x + e.time[0] * note_size, y: piano_roll_height + chord_text_size }));
  chord_svgs.forEach(e => e.roman.setAttributes({ x: current_time_x + e.time[0] * note_size, y: piano_roll_height + chord_text_size * 2 + chord_name_margin }));
  chord_svgs.forEach(e => e.key.setAttributes({ x: current_time_x + key_text_pos + e.time[0] * note_size, y: piano_roll_height + chord_text_size * 2 + chord_name_margin }));

  white_BGs.forEach((_, i) => _.forEach((_, j) => _.setAttributes({ x: 0, y: octave_height * i + black_key.height * white_position[j], width: piano_roll_width, height: black_key.height })));
  black_BGs.forEach((_, i) => _.forEach((_, j) => _.setAttributes({ x: 0, y: octave_height * i + black_key.height * black_position[j], width: piano_roll_width, height: black_key.height })));
  white_keys.forEach((_, i) => _.forEach((_, j) => _.setAttributes({ x: 0, y: octave_height * i + white_key.height * j /* TODO: 位置をずらす */, width: white_key.width, height: white_key.height })));
  black_keys.forEach((_, i) => _.forEach((_, j) => _.setAttributes({ x: 0, y: octave_height * i + black_key.height * black_position[j], width: black_key.width, height: black_key.height })));
  octave_BG.forEach((_, i) => _.setAttributes({ x: 0, y: octave_height * i, width: piano_roll_width, height: octave_height }));
  octave_keys.forEach((_, i) => _.setAttributes({ x: 0, y: octave_height * i, width: piano_roll_width, height: octave_height }));
  piano_roll.setAttributes({ x: 0, y: 0, width: piano_roll_width, height: piano_roll_height + chord_text_size * 2 + chord_name_margin });

  current_time_line.setAttributes({ x1: current_time_x, x2: current_time_x, y1: 0, y2: piano_roll_height });
};

const refresh = () => {
  const piano_roll_width = getPianoRollWidth();
  const note_size = piano_roll_width / piano_roll_time;
  const now = audio.currentTime;
  const std_pos = now * note_size;
  chord_svgs.forEach(e => e.rects.forEach(rect => rect.setAttributes({ x: current_time_x + e.time[0] * note_size - std_pos })));  // SVG.rect の位置替える
  chord_svgs.forEach(e => e.chord.setAttributes({ x: current_time_x + e.time[0] * note_size - std_pos }));
  chord_svgs.forEach(e => e.roman.setAttributes({ x: current_time_x + e.time[0] * note_size - std_pos }));
  chord_svgs.forEach(e => e.key.setAttributes({ x: current_time_x + key_text_pos + e.time[0] * note_size - std_pos }));
  detected_melody_svgs.forEach(e => e.rect.setAttributes({ x: current_time_x + e.time[0] * note_size - std_pos }));
  melody_svgs.forEach(e => e.rect.setAttributes({ x: current_time_x + e.time[0] * note_size - std_pos }));
  refresh_arrow(arrow_svgs, note_size, current_time_x, std_pos);

  const reservation_range = 1/15
  const melody_range = search_melody_in_range(melodies, now, now + reservation_range/*(piano_roll_width - current_time_x) / note_size*/)
  for (let i = melody_range.begin_index; i <= melody_range.end_index; i++) {
    const e = melodies[i];
    // console.log(`now:${now} - e.time[0]:${e.time[0]}`)
    if (e.sound_reserved === false) {
      play([440 * Math.pow(2, (e.note - 69) / 12)], e.time[0] - now, (e.time[1] - e.time[0]));
      e.sound_reserved = true;
      setTimeout(() => {
        e.sound_reserved=false;
      }, reservation_range * 1000);
    }
  }
};

// audio.addEventListener("timeupdate", refresh);


window.onresize = (ev) => {
  draw(getPianoRollWidth());
};

const update = () => {
  requestAnimationFrame(update);
  refresh();
};

draw(getPianoRollWidth());
update();

console.log(search_melody_in_range(melodies, 30, 90));