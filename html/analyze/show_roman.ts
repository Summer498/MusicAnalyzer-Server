import { SVG } from "../lib/HTML/HTML.js";
import { Math } from "../lib/Math/Math.js";
import { RomanChord } from "../../chordToRoman/build/lib/TonalEx/TonalEx.js";
import { hsv2rgb } from "../lib/Color/Color.js";

type timeAndRoman = { time: number[][], progression: RomanChord[] };
interface MusicAnalyzerWindow extends Window {
  MusicAnalyzer: { roman: timeAndRoman[] }
}
declare const window: MusicAnalyzerWindow;

const romans = window.MusicAnalyzer.roman;
console.log(romans);
// const notes = roman[0].chords[1][2].notes;  // 0 個目のコード列の1番目の推定候補の2個目のコードの構成音

const max = (a: number, b: number) => (a > b) ? a : b;
const bandpass = (a: number, x: number, b: number) => (b < x) ? b : (x < a) ? a : x;

// WARNING: この方法ではオクターブの差を見ることはできない
// バックエンドから送られてくる Roman がオクターブの差を吸収しているため, オクターブの差を見るには, そちらも要修正
// autoChord で符号化している時点で差が吸収されている & TonalEx 回りでもオクターブの差を無いものとして扱っている(?)
const noteToChroma = (note: string) => {
  const base = max("A1BC2D3EF4G5".indexOf(note[0]), "a1bc2d3ef4g5".indexOf(note[0]));
  const acc = (note.length > 1) ? "b♮#".indexOf(note[1]) - 1 : 0;
  return base + acc;
}

const lastElement = <T>(arr: T[]) => arr[arr.length - 1]

//const roman = romans[0].progression[2];  // 0 個目のコード列の2番目のコードの構成音
//const chromas = roman.chord.notes.map((note: string) => noteToChroma(note))
//console.log(romans[0].time[2]);  // 時間
//console.log(chromas);

const chord_time_range = lastElement(lastElement(romans).time)[1]
console.log(`chord_range:${chord_time_range}`);

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
const octave_height = 14 * 12;
const octave_cnt = 2;
const white_key = new RectParameters({ width: 36, height: octave_height / 7, fill: "#fff", stroke: "#000", });
const white_back_fill = "#eee";
const white_back_stroke = "#000";
const black_key = new RectParameters({ width: (white_key.width * 2) / 3, height: octave_height / 12, fill: "#444", stroke: "#000", });
const black_back_fill = "#ccc";
const black_back_stroke = "#000";
let piano_roll_width = window.innerWidth - 48;

const piano_roll_height = octave_height * octave_cnt;
const black_position = [1, 3, 5, 8, 10];
const white_position = Math.getRange(0, 12).filter(e => !black_position.includes(e));

// コードを表す部分を作成
const romanToColor = (roman: string) => {
  let i: number | undefined = undefined;
  const ROMAN = roman.toUpperCase()
  if (0) { }
  else if (ROMAN.includes("VII")) { i = 6; }
  else if (ROMAN.includes("VI")) { i = 3; }
  else if (ROMAN.includes("IV")) { i = 4; }  // IV は V よりさあきに検知しておく
  else if (ROMAN.includes("V")) { i = 0; }
  else if (ROMAN.includes("III")) { i = 1; }
  else if (ROMAN.includes("II")) { i = 5; }
  else if (ROMAN.includes("I")) { i = 2 }
  if (i === undefined) { console.log("888", roman); return "#000000"; }
  const col = hsv2rgb(360 * i / 7, 0.5, 0.9);
  return `#${((col[0] * 256 + col[1]) * 256 + col[2]).toString(16)}`;
}

const shorten = (chord: string) => {
  const M7 = chord.replace("major seventh", "M7")
  const major = M7.replace("major", "")
  const minor = major.replace("minor ", "m").replace("minor", "m")
  const seventh = minor.replace("seventh", "7")
  return seventh
}

const draw = () => {
  // スライドバーのパラメータを設定
  const slide_bar_param = new RectParameters({ width: piano_roll_width, height: 12, fill: "#ccf", stroke: "#88f" });

  // コードを表すノートを作成
  const chord_text_size = 32
  const piano_roll_time = 30;
  const chord_svg_elements = romans.map(time_and_roman =>
    time_and_roman.progression.map((roman, i) => {
      const time = time_and_roman.time[i];
      const x = time[0] * piano_roll_width / piano_roll_time;
      const width = (time[1] - time[0]) * piano_roll_width / piano_roll_time;
      const height = black_key.height;
      const fill = romanToColor(roman.roman);

      const ret: { time: number, rect: SVGRectElement, text: SVGTextElement }[]
        = roman.chord.notes.map((note: string) => {
          const y = slide_bar_param.height + (12 - noteToChroma(note) + 2) * black_key.height;
          return {
            time: x,
            rect: SVG.rect({ x, y, width, height, fill, stroke: "#444" }),
            text: SVG.text({ x, y: `${piano_roll_height + chord_text_size}px` }, shorten(roman.roman))
          }
        }).flat();
      return ret;
    }).flat()
  ).flat()

  // スライドバーを作成
  const slide_bar = SVG.rect({ x: `1px`, y: `${slide_bar_param.height / 4}px`, width: `${slide_bar_param.width - 2}px`, height: `${slide_bar_param.height / 2}px`, rx: `${slide_bar_param.height / 4}px`, ry: `${slide_bar_param.height / 4}px`, fill: `${slide_bar_param.fill}`, stroke: `${slide_bar_param.stroke}` });
  const slide_bar_bounding_rect = slide_bar.getBoundingClientRect();
  const slide_button = SVG.circle({ cx: `${slide_bar_param.height / 2}px`, cy: `${slide_bar_param.height / 2}px`, r: `${slide_bar_param.height / 2 - 1}px`, fill: "#88f", stroke: "#44f" });

  // スライドバーのイベントリスナを作成
  let slide_button_active = false;
  slide_button.addEventListener("mousedown", _ => {
    if (!slide_button_active) { slide_button_active = true; }
  });
  document.addEventListener("mousemove", ev => {
    if (slide_button_active) {
      const x = bandpass(slide_bar_param.height, ev.x - slide_bar_bounding_rect.x, slide_bar_param.width) - slide_bar_param.height / 2
      const position = (x - slide_bar_param.height / 2) / (slide_bar_param.width - slide_bar_param.height);
      chord_svg_elements.forEach(e => e.rect.setAttribute("x", `${e.time - position * chord_time_range * piano_roll_width / piano_roll_time}px`));  // TODO: SVG.rect の位置替える
      chord_svg_elements.forEach(e => e.text.setAttribute("x", `${e.time - position * chord_time_range * piano_roll_width / piano_roll_time}px`));
      slide_button.setAttribute("cx", `${x}px`);
    }
  });
  document.addEventListener("mouseup", _ => { slide_button_active = false; });

  const piano_roll = SVG.svg(
    { name: "piano-roll", x: 0, y: 0, width: `${piano_roll_width}px`, height: `${piano_roll_height + slide_bar_param.height + chord_text_size}px`, },
    undefined,
    [
      SVG.g(
        { name: "slide-bar", x: 0, y: 0, width: `${slide_bar_param.width}px`, height: `${slide_bar_param.height + chord_text_size}px` },
        undefined,
        [slide_bar, slide_button]
      ),
      Math.getRange(0, octave_cnt).map(i =>
        SVG.g(
          { name: "octave", x: 0, y: `${slide_bar_param.height + octave_height * i}px`, width: `${piano_roll_width}px`, height: `${octave_height}px`, },
          undefined,
          [
            white_position.map(j =>
              SVG.rect({ x: 0, y: `${slide_bar_param.height + octave_height * i + black_key.height * j}px`, width: `${piano_roll_width}px`, height: `${black_key.height}px`, fill: white_back_fill, stroke: white_back_stroke, })
            ),
            black_position.map(j =>
              SVG.rect({ x: 0, y: `${slide_bar_param.height + octave_height * i + black_key.height * j}px`, width: `${piano_roll_width}px`, height: `${black_key.height}px`, fill: black_back_fill, stroke: black_back_stroke, })
            ),
            chord_svg_elements.map(e => e.rect),
            chord_svg_elements.map(e => e.text),
            Math.getRange(0, 7).map(j =>
              SVG.rect({ x: 0, y: `${slide_bar_param.height + octave_height * i + white_key.height * j}px`, width: `${white_key.width}px`, height: `${white_key.height}px`, fill: white_key.fill, stroke: white_key.stroke, })
            ),
            black_position.map(j =>
              SVG.rect({ x: 0, y: `${slide_bar_param.height + octave_height * i + black_key.height * j}px`, width: `${black_key.width}px`, height: `${black_key.height}px`, fill: black_key.fill, stroke: black_key.stroke, })
            ),
          ]
        )
      )]
  );

  const piano_roll_place = document.getElementsByName("piano-roll-place")[0];
  if (piano_roll_place.children.length > 0) {
    piano_roll_place.removeChild(piano_roll_place.children[0]);
  }
  piano_roll_place.insertAdjacentElement("afterbegin", piano_roll);
}
draw();
window.onresize = (ev) => {
  piano_roll_width = window.innerWidth - 48;
  draw();
}
