import { SVG } from "../lib/HTML/HTML.js";
import { vSub, vMod, getRange, vAdd } from "../lib/Math/Math.js";
import { RomanChord } from "../../chordToRoman/build/lib/TonalEx/TonalEx.js";
import { hsv2rgb } from "../lib/Color/Color.js";

type timeAndRoman = { time: number[], progression: RomanChord };
type timeAndMelody = { time: number[], note: number }
type MelodyAnalysis = {
  gravity: {
    destination: number | undefined,
    resolved: boolean,
  }[]
}
type timeAndMelodyAnalysis = { time: number[], note: number, roman_name: string | undefined, melodyAnalysis: MelodyAnalysis }

interface MusicAnalyzerWindow extends Window {
  MusicAnalyzer: { roman: timeAndRoman[], melody: timeAndMelodyAnalysis[] }
}
declare const window: MusicAnalyzerWindow;

const romans = window.MusicAnalyzer.roman;
const melodies = window.MusicAnalyzer.melody;
console.log(romans);
console.log(melodies);

// const notes = roman[0].chords[1][2].notes;  // 0 個目のコード列の1番目の推定候補の2個目のコードの構成音

const max = (a: number, b: number) => (a > b) ? a : b;

// WARNING: この方法ではオクターブの差を見ることはできない
// バックエンドから送られてくる Roman がオクターブの差を吸収しているため, オクターブの差を見るには, そちらも要修正
// autoChord で符号化している時点で差が吸収されている & TonalEx 回りでもオクターブの差を無いものとして扱っている(?)
const noteToChroma = (note: string) => {
  const base = max("A1BC2D3EF4G5".indexOf(note[0]), "a1bc2d3ef4g5".indexOf(note[0]));
  const acc = (note.length > 1) ? "b♮#".indexOf(note[1]) - 1 : 0;
  return base + acc;
}

const rgbToString = (rgb: number[]) => {
  let ret = "#"
  rgb.forEach(e => { ret = `${ret}${(e < 16) ? `0` : ``}${e.toString(16)}` })
  return ret;
}

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
const white_back_fill = "#eee";
const white_back_stroke = "#000";
const black_key = new RectParameters({ width: (white_key.width * 2) / 3, height: octave_height / 12, fill: "#444", stroke: "#000", });
const black_back_fill = "#ccc";
const black_back_stroke = "#000";
const getPianoRollWidth = () => window.innerWidth - 48;

const piano_roll_height = octave_height * octave_cnt;
const black_position = vMod(vAdd([2, 4, 6, 9, 11], piano_roll_begin), 12);
const white_position = getRange(0, 12).filter(e => !black_position.includes(e));
const chord_text_size = 32
const piano_roll_time = 5;  // 1 画面に収める曲の長さ[秒]

const triangle_width = 5
const triangle_height = 0.25

// コードを表す部分を作成
const romanToColor = (roman: string, s: number, v: number) => {
  let i: number | undefined = undefined;
  const ROMAN = roman.toUpperCase()
  if (0) { }
  else if (ROMAN.includes("VII")) { i = 6; }
  else if (ROMAN.includes("VI")) { i = 3; }
  else if (ROMAN.includes("IV")) { i = 4; }  // IV は V より先に検知しておく
  else if (ROMAN.includes("V")) { i = 0; }
  else if (ROMAN.includes("III")) { i = 1; }
  else if (ROMAN.includes("II")) { i = 5; }
  else if (ROMAN.includes("I")) { i = 2 }
  if (i === undefined) { console.log("888", roman); return "#000000"; }
  const col = hsv2rgb(360 * i / 7, s, v);
  return rgbToString(col);
}

const shorten = (chord: string) => {
  const M7 = chord.replace("major seventh", "M7")
  const major = M7.replace("major", "")
  const minor = major.replace("minor ", "m").replace("minor", "m")
  const seventh = minor.replace("seventh", "7")
  return seventh
}


// svg element の作成
const chord_svg_elements = romans.map(time_and_roman => {
  const notes: string[] = time_and_roman.progression.chord.notes;
  return {
    rects: notes.map(note => SVG.rect({ name: "chord-note", fill: romanToColor(time_and_roman.progression.roman, 0.5, 0.9), stroke: "#444" })),
    text: SVG.text({ stroke: romanToColor(time_and_roman.progression.roman, 1, 0.75) }, shorten(time_and_roman.progression.roman)),
    time: time_and_roman.time,
    notes,
  };
}
);
const melody_svg_elements = melodies.map(e => {
  return {
    rect: SVG.rect({ name: "chord-note", fill: rgbToString(hsv2rgb(180 + 360 * 2 / 7, 0.5, 0.9)), stroke: "#444" }),
    time: e.time,
    note: e.note
  }
})

const arrow_svg_elements =
  (() => {
    let ret: {
      triangle: SVGPolygonElement,
      line: SVGLineElement,
      time: number[],
      note: number,
      destination: number
    }[] = [];

    const stroke = rgbToString([0, 0, 0]);
    melodies.forEach(e => {
      const fill = rgbToString([0, 0, 0]);
      // let fill = rgbToString(hsv2rgb(180 + 360 * 2 / 7, 0.5, 0.9));
      e.melodyAnalysis.gravity.forEach((gravity, i) => {
        // if (i === 1 && e.roman_name !== undefined) { fill = romanToColor(e.roman_name, 0.5, 0.9) }
        if (gravity.resolved && gravity.destination !== undefined) {
          ret.push({
            triangle: SVG.polygon({ name: "gravity-arrow", stroke, fill, "stroke-width": 1 }),
            line: SVG.line({ name: "gravity-arrow", stroke, "stroke-width": 1 }),
            time: e.time,
            note: e.note,
            destination: gravity.destination
          })
        }
      })
    })
    return ret;
  })();

const white_BGs = [...Array(octave_cnt)].map(i => [...Array(7)].map(j =>
  SVG.rect({ name: "white-BG", fill: white_back_fill, stroke: white_back_stroke, })
));
const black_BGs = [...Array(octave_cnt)].map(i => [...Array(5)].map(j =>
  SVG.rect({ name: "black-BG", fill: black_back_fill, stroke: black_back_stroke, })
));
const white_keys = [...Array(octave_cnt)].map(i => [...Array(7)].map(j =>
  SVG.rect({ name: "white-key", fill: white_key.fill, stroke: white_key.stroke, })
));
const black_keys = [...Array(octave_cnt)].map(i => [...Array(5)].map(j =>
  SVG.rect({ name: "black-key", fill: black_key.fill, stroke: black_key.stroke, })
));
const chord_rects = chord_svg_elements.flatMap(e => e.rects);
const chord_names = chord_svg_elements.map(e => e.text);
const melody_rects = melody_svg_elements.map(e => e.rect);
const gravity_arrow_lines = arrow_svg_elements.map(e => e.line);
const gravity_arrow_triangles = arrow_svg_elements.map(e => e.triangle);
const octave_BG = [...Array(octave_cnt)].map((_, i) => SVG.g({ name: "octave-BG" }, undefined, [white_BGs[i], black_BGs[i]]));
const octave_keys = [...Array(octave_cnt)].map((_, i) => SVG.g({ name: "octave-keys" }, undefined, [white_keys[i], black_keys[i]]));
const piano_roll = SVG.svg({ name: "piano-roll" }, undefined, [octave_BG, chord_rects, chord_names, melody_rects, gravity_arrow_lines, gravity_arrow_triangles, octave_keys]);
const piano_roll_place = document.getElementById("piano-roll-place");
piano_roll_place?.insertAdjacentElement("afterbegin", piano_roll);



const draw = (piano_roll_width: number) => {
  // 各 svg のパラメータを更新する
  const note_size = piano_roll_width / piano_roll_time;
  chord_svg_elements.forEach(e => e.rects.forEach((rect, i) => rect.setAttributes({
    x: e.time[0] * note_size,
    y: (26 - noteToChroma(e.notes[i])) * black_key.height,
    width: (e.time[1] - e.time[0]) * note_size,
    height: black_key.height,
  })))
  melody_svg_elements.forEach(e => e.rect.setAttributes({
    x: e.time[0] * note_size,
    y: (piano_roll_begin - e.note) * black_key.height,
    width: (e.time[1] - e.time[0]) * note_size,
    height: black_key.height,
  }))
  arrow_svg_elements.forEach(e => {
    e.line.setAttributes({
      x1: ((e.time[1] - e.time[0]) / 2 + e.time[0]) * note_size,
      y1: (piano_roll_begin + 0.5 - e.note) * black_key.height,
      x2: ((e.time[1] - e.time[0]) / 2 + e.time[0]) * note_size,
      y2: (piano_roll_begin + 0.5 - e.destination) * black_key.height
    })
    const tri_pos = [
      ((e.time[1] - e.time[0]) / 2 + e.time[0]) * note_size,
      (piano_roll_begin + 0.5 - e.destination) * black_key.height,
      ((e.time[1] - e.time[0]) / 2 + e.time[0]) * note_size - triangle_width,
      (piano_roll_begin + 0.5 - e.destination + (e.destination - e.note) * triangle_height) * black_key.height,
      ((e.time[1] - e.time[0]) / 2 + e.time[0]) * note_size + triangle_width,
      (piano_roll_begin + 0.5 - e.destination + (e.destination - e.note) * triangle_height) * black_key.height
    ]
    e.triangle.setAttributes({
      points: `${tri_pos[0]},${tri_pos[1]},${tri_pos[2]},${tri_pos[3]},${tri_pos[4]},${tri_pos[5]}`
    })
  })

  chord_svg_elements.forEach(e => e.text.setAttributes({ x: e.time[0] * note_size, y: piano_roll_height + chord_text_size }))
  white_BGs.forEach((_, i) => _.forEach((_, j) => _.setAttributes({ x: 0, y: octave_height * i + black_key.height * white_position[j], width: piano_roll_width, height: black_key.height })));
  black_BGs.forEach((_, i) => _.forEach((_, j) => _.setAttributes({ x: 0, y: octave_height * i + black_key.height * black_position[j], width: piano_roll_width, height: black_key.height })));
  white_keys.forEach((_, i) => _.forEach((_, j) => _.setAttributes({ x: 0, y: octave_height * i + white_key.height * j /* TODO: 位置をずらす */, width: white_key.width, height: white_key.height })));
  black_keys.forEach((_, i) => _.forEach((_, j) => _.setAttributes({ x: 0, y: octave_height * i + black_key.height * black_position[j], width: black_key.width, height: black_key.height })))
  octave_BG.forEach((_, i) => _.setAttributes({ x: 0, y: octave_height * i, width: piano_roll_width, height: octave_height }));
  octave_keys.forEach((_, i) => _.setAttributes({ x: 0, y: octave_height * i, width: piano_roll_width, height: octave_height }));
  piano_roll.setAttributes({ x: 0, y: 0, width: piano_roll_width, height: piano_roll_height + chord_text_size })
}

const refresh = () => {
  const note_size = getPianoRollWidth() / piano_roll_time;
  const std_pos = audio.currentTime * note_size;
  chord_svg_elements.forEach(e => e.rects.forEach(rect => rect.setAttributes({ x: e.time[0] * note_size - std_pos })));  // SVG.rect の位置替える
  chord_svg_elements.forEach(e => e.text.setAttributes({ x: e.time[0] * note_size - std_pos }));
  melody_svg_elements.forEach(e => e.rect.setAttributes({ x: e.time[0] * note_size - std_pos }));
  arrow_svg_elements.forEach(e => {
    e.line.setAttributes({
      x1: ((e.time[1] - e.time[0]) / 2 + e.time[0]) * note_size - std_pos,
      x2: ((e.time[1] - e.time[0]) / 2 + e.time[0]) * note_size - std_pos
    });
    const tri_pos = [
      ((e.time[1] - e.time[0]) / 2 + e.time[0]) * note_size - std_pos,
      (piano_roll_begin + 0.5 - e.destination) * black_key.height,
      ((e.time[1] - e.time[0]) / 2 + e.time[0]) * note_size - triangle_width - std_pos,
      (piano_roll_begin + 0.5 - e.destination + (e.destination - e.note) * triangle_height) * black_key.height,
      ((e.time[1] - e.time[0]) / 2 + e.time[0]) * note_size + triangle_width - std_pos,
      (piano_roll_begin + 0.5 - e.destination + (e.destination - e.note) * triangle_height) * black_key.height
    ]
    e.triangle.setAttributes({
      points: `${tri_pos[0]},${tri_pos[1]},${tri_pos[2]},${tri_pos[3]},${tri_pos[4]},${tri_pos[5]}`
    })
  })
}

audio.addEventListener("timeupdate", refresh);

draw(getPianoRollWidth());
window.onresize = (ev) => {
  draw(getPianoRollWidth());
}
