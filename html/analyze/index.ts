import { HTML, SVG } from "../../packages/HTML";
import { vMod, getRange, vAdd, mod } from "../../packages/Math";
import { hsv2rgb, rgbToString } from "../../packages/Color";
import { play } from "../../packages/Synth";
import { _Chord, _Note, _Scale } from "../../packages/TonalObjects";
import { noteToColor, shorten_chord, shorten_key } from "../../packages/chordView";
import { search_items_in_range, TimeAnd } from "../../packages/timeAnd";
import { TimeAndRomanAnalysis } from "../../packages/chordToRoman";
import { TimeAndMelodyAnalysis as _TimeAndMelodyAnalysis } from "../../packages/melodyAnalyze";

const debug_mode = true;
const debug_log_element = HTML.p({ name: "debug" });
if (debug_mode) {
  document.body.insertAdjacentElement("afterbegin", debug_log_element);
}

interface MusicAnalyzerWindow extends Window {
  MusicAnalyzer: { roman: TimeAndRomanAnalysis[], melody: _TimeAndMelodyAnalysis[] }
  play: typeof play
}
declare const window: MusicAnalyzerWindow;

interface TimeAndMelodyAnalysis extends _TimeAndMelodyAnalysis {
  sound_reserved: boolean
}

const detected_romans: TimeAndRomanAnalysis[] = window.MusicAnalyzer.roman.map(e => e);
const detected_melodies: _TimeAndMelodyAnalysis[] = window.MusicAnalyzer.melody.map(e => e);
const romans = detected_romans.map(e => e);
const melodies = detected_melodies.map(e => {
  const res: TimeAndMelodyAnalysis = {
    ...e,
    sound_reserved: false
  };
  return res;
});

window.play = play;  // NOTE:コンソールデバッグ用
console.log(romans);
console.log(melodies);
// const notes = roman[0].chords[1][2].notes;  // 0 個目のコード列の1番目の推定候補の2個目のコードの構成音


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

// --- ピアノロールの描画パラメータ
const getPianoRollWidth = () => window.innerWidth - 48;  // innerWidth が動的に変化する
const octave_height = 3 * 84;  // 7 白鍵と 12 半音をきれいに描画するには 7 * 12 の倍数が良い
const octave_cnt = 3;
const piano_roll_begin = 83;
const white_key_prm = new RectParameters({ width: 36, height: octave_height / 7, fill: "#fff", stroke: "#000", });
const black_key_prm = new RectParameters({ width: white_key_prm.width * 2 / 3, height: octave_height / 12, fill: "#444", stroke: "#000", });
const white_bgs_prm = new RectParameters({ width: getPianoRollWidth(), height: octave_height / 12, fill: "#eee", stroke: "#000", });
const black_bgs_prm = new RectParameters({ width: getPianoRollWidth(), height: octave_height / 12, fill: "#ccc", stroke: "#000", });

const piano_roll_height = octave_height * octave_cnt;
const black_position = vMod(vAdd([2, 4, 6, 9, 11], piano_roll_begin), 12);
const white_position = getRange(0, 12).filter(e => !black_position.includes(e));
const chord_text_em = 4;
const chord_text_size = 16 * chord_text_em;
const key_text_pos = -chord_text_size * 3;
const piano_roll_time_length = 5;  // 1 画面に収める曲の長さ[秒]

const triangle_width = 5;
const triangle_height = 0.25;


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
    const append = search_items_in_range(this.all, begin, end);
    this.all.slice(append.begin_index, append.end_index).forEach(e => { this.show.push(e); this.group.appendChild(e.svg); });  // 必要分全部追加する
  }
}

// svg element の作成
const chord_rects = new SvgWindow("chords",
  romans.map(e => getRange(0, octave_cnt).map(oct => _Chord.get(e.chord).notes.map(note => ({
    svg: SVG.rect({ fill: noteToColor(_Chord.get(e.chord).tonic!, 0.5, 0.9), stroke: "#444" }),
    begin: e.begin,
    end: e.end,
    y: -1 - mod(_Note.chroma(note), 12) + 12 * (oct + 1),
  })))).flat(2)
);
const chord_names = new SvgWindow("chord-names",
  romans.map(e => ({
    svg: SVG.text({ id: "chord-name", "font-family": 'Times New Roman', "font-size": `${chord_text_em}em`, fill: noteToColor(_Chord.get(e.chord).tonic!, 1, 0.75) || "#000" }, shorten_chord(_Chord.get(e.chord).name)),
    begin: e.begin,
    end: e.end,
  }))
);
const chord_romans = new SvgWindow("roman-names",
  romans.map(e => ({
    svg: SVG.text({ id: "roman-name", "font-family": 'Times New Roman', "font-size": `${chord_text_em}em`, fill: noteToColor(_Chord.get(e.chord).tonic!, 1, 0.75) || "#000" }, shorten_chord(e.roman)),
    begin: e.begin,
    end: e.end,
  }))
);
const chord_keys = new SvgWindow("key-names",
  romans.map(e => ({
    svg: SVG.text({ id: "key-name", "font-family": 'Times New Roman', "font-size": `${chord_text_em}em`, fill: noteToColor(_Scale.get(e.scale).tonic!, 1, 0.75) || "#000" }, shorten_key(_Scale.get(e.scale))),
    begin: e.begin,
    end: e.end,
  }))
);

const all_d_melody_svgs = new SvgWindow("detected-melody",
  detected_melodies.map(e => ({
    svg: SVG.rect({ name: "melody-note", fill: rgbToString(hsv2rgb(0, 0, 0.5)), stroke: "#444" }),
    begin: e.begin,
    end: e.end,
    note: e.note,
  }))
);

const all_melody_svgs = new SvgWindow("melody",
  melodies.map(e => ({
    svg: SVG.rect({ name: "melody-note", fill: rgbToString(hsv2rgb(180 + 360 * 2 / 7, 0.5, 0.9)), stroke: "#444" }),
    begin: e.begin,
    end: e.end,
    note: e.note,
  }))
);

const arrow_svgs = (() => {
  const ret: {
    triangle: SVGPolygonElement,
    line: SVGLineElement,
    begin: number,
    end: number,
    note: number,
    next: TimeAndMelodyAnalysis,
    destination: number
  }[] = [];

  const stroke = rgbToString([0, 0, 0]);
  melodies.forEach((e, i) => {
    const next = melodies.length <= i + 1 ? melodies[i] : melodies[i + 1];
    const fill = rgbToString([0, 0, 0]);
    // let fill = rgbToString(hsv2rgb(180 + 360 * 2 / 7, 0.5, 0.9));
    e.melody_analysis.gravity.forEach(gravity => {
      // if (i === 1 && e.roman_name !== undefined) { fill = romanToColor(e.roman_name, 0.5, 0.9) }
      if (gravity.resolved && gravity.destination !== undefined) {
        ret.push({
          triangle: SVG.polygon({ name: "gravity-arrow", stroke, fill, "stroke-width": 5 }),
          line: SVG.line({ name: "gravity-arrow", stroke, "stroke-width": 5 }),
          begin: e.begin,
          end: e.end,
          note: e.note,
          next,
          destination: gravity.destination
        });
      }
    });
  });
  return ret;
})();


const white_BGs = [...Array(octave_cnt)].map(_ => [...Array(7)].map(_ => SVG.rect({ name: "white-BG", fill: white_bgs_prm.fill, stroke: white_bgs_prm.stroke, })));
const black_BGs = [...Array(octave_cnt)].map(_ => [...Array(5)].map(_ => SVG.rect({ name: "black-BG", fill: black_bgs_prm.fill, stroke: black_bgs_prm.stroke, })));
const white_key = [...Array(octave_cnt)].map(_ => [...Array(7)].map(_ => SVG.rect({ name: "white-key", fill: white_key_prm.fill, stroke: white_key_prm.stroke, })));
const black_key = [...Array(octave_cnt)].map(_ => [...Array(5)].map(_ => SVG.rect({ name: "black-key", fill: black_key_prm.fill, stroke: black_key_prm.stroke, })));
const octave_BGs = [...Array(octave_cnt)].map((_, i) => SVG.g({ name: "octave-BG" }, undefined, [white_BGs[i], black_BGs[i]]));
const octave_key = [...Array(octave_cnt)].map((_, i) => SVG.g({ name: "octave-keys" }, undefined, [white_key[i], black_key[i]]));
const current_time_line = SVG.line({ name: "current_time", "stroke-width": 5, stroke: "#000" });
const piano_roll = SVG.svg({ name: "piano-roll" }, undefined, [
  // 奥側
  SVG.g({ name: "octave-BGs" }, undefined, octave_BGs),

  chord_rects.group,
  chord_names.group,
  chord_romans.group,
  chord_keys.group,

  all_d_melody_svgs.group,
  all_melody_svgs.group,
  SVG.g({ name: "gravities" }, undefined, [
    arrow_svgs.map(e => e.line),
    arrow_svgs.map(e => e.triangle)
  ]),

  SVG.g({ name: "octave-keys" }, undefined, octave_key),
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
const refresh_arrow = (arrow_svgs: ArrowSVGs, note_size: number, current_time_x: number, std_pos: number) => {
  arrow_svgs.forEach((e, i) => {
    if (arrow_svgs.length <= i + 1) { return; }
    const next = e.next;
    const center = (e.end - e.begin) / 2;
    const src_x = (center + e.begin) * note_size + current_time_x - std_pos;
    const dst_x = next.begin * note_size + current_time_x - std_pos;
    const src_y = (piano_roll_begin + 0.5 - e.note) * black_key_prm.height;
    const dst_y = (piano_roll_begin + 0.5 - e.destination) * black_key_prm.height;
    const theta = Math.atan2(dst_y - src_y, dst_x - src_x) + Math.PI / 2;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const w = 5; triangle_width;
    const h = 5; -black_key_prm.height * triangle_height;
    e.line.setAttributes({ x1: src_x, x2: dst_x, y1: src_y, y2: dst_y });
    const tri_pos = [
      dst_x, dst_y,
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

let old_time = Date.now();
const fps_element = HTML.p({ name: "fps" }, `fps:${0}`);

const refresh = () => {
  const current_time_x = getPianoRollWidth() / 4;
  const piano_roll_width = getPianoRollWidth();
  const note_size = piano_roll_width / piano_roll_time_length;
  const now = audio.currentTime;

  const chord_name_margin = 5;
  chord_rects.updateShow(now - current_time_x, now + piano_roll_time_length);
  chord_names.updateShow(now - current_time_x, now + piano_roll_time_length);
  chord_romans.updateShow(now - current_time_x, now + piano_roll_time_length);
  chord_keys.updateShow(now - current_time_x, now + piano_roll_time_length);
  all_d_melody_svgs.updateShow(now - current_time_x, now + piano_roll_time_length);
  all_melody_svgs.updateShow(now - current_time_x, now + piano_roll_time_length);
  chord_rects.show.forEach(e => e.svg.setAttributes({ x: current_time_x + (e.begin - now) * note_size, y: e.y * black_key_prm.height, width: (e.end - e.begin) * note_size, height: black_key_prm.height, }));
  chord_names.show.forEach(e => e.svg.setAttributes({ x: current_time_x + (e.begin - now) * note_size, y: piano_roll_height + chord_text_size }));
  chord_romans.show.forEach(e => e.svg.setAttributes({ x: current_time_x + (e.begin - now) * note_size, y: piano_roll_height + chord_text_size * 2 + chord_name_margin }));
  chord_keys.show.forEach(e => e.svg.setAttributes({ x: current_time_x + (e.begin - now) * note_size + key_text_pos, y: piano_roll_height + chord_text_size * 2 + chord_name_margin }));

  all_d_melody_svgs.show.forEach(e => e.svg.setAttributes({ x: current_time_x + (e.begin - now) * note_size, y: (piano_roll_begin - e.note) * black_key_prm.height, width: (e.end - e.begin) * note_size, height: black_key_prm.height, onclick: "insertMelody()", }));
  all_melody_svgs.show.forEach(e => e.svg.setAttributes({ x: current_time_x + (e.begin - now) * note_size, y: (piano_roll_begin - e.note) * black_key_prm.height, width: (e.end - e.begin) * note_size, height: black_key_prm.height, onclick: "deleteMelody()", }));
  refresh_arrow(arrow_svgs, note_size, current_time_x, now * note_size);

  const reservation_range = 1 / 15;

  const melody_range = search_items_in_range(melodies, now, now + reservation_range);
  for (let i = melody_range.begin_index; i < melody_range.end_index; i++) {
    const e = melodies[i];
    if (e.sound_reserved === false) {
      play([440 * Math.pow(2, (e.note - 69) / 12)], e.begin - now, e.end - e.begin);
      e.sound_reserved = true;
      setTimeout(() => {
        e.sound_reserved = false;
      }, reservation_range * 1000);
    }
  }
  const now_sec = Date.now();
  fps_element.textContent = `fps:${Math.floor(1000 / (now_sec - old_time))}`;
  old_time = now_sec;
};

const setBgSvgParams = (rects: SVGRectElement[][], rect_param: RectParameters, position: number[]) => {
  rects.forEach((_, i) => _.forEach((_, j) => _.setAttributes({ x: 0, y: octave_height * i + rect_param.height * position[j], width: rect_param.width, height: rect_param.height })));
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
  setBgSvgParams(black_BGs, black_bgs_prm, black_position);
  setBgSvgParams(white_BGs, white_bgs_prm, white_position);
  setBgSvgParams(black_key, black_key_prm, black_position);
  setBgSvgParams(white_key, white_key_prm, [0, 1, 2, 3, 4, 5, 6]);
  octave_BGs.forEach((_, i) => _.setAttributes({ x: 0, y: octave_height * i, width: piano_roll_width, height: octave_height }));
  octave_key.forEach((_, i) => _.setAttributes({ x: 0, y: octave_height * i, width: piano_roll_width, height: octave_height }));
  piano_roll.setAttributes({ x: 0, y: 0, width: piano_roll_width, height: piano_roll_height + chord_text_size * 2 + chord_name_margin });

  current_time_line.setAttributes({ x1: current_time_x, x2: current_time_x, y1: 0, y2: piano_roll_height });
  refresh();
};


// ---------- main ---------- //
const main = () => {
  console.log(search_items_in_range(melodies, 30, 90));
  // audio.addEventListener("timeupdate", refresh);

  const update = () => {
    requestAnimationFrame(update);
    refresh();
  };

  window.onresize = e => draw();
  draw();
  update();

  1 && document.body.insertAdjacentElement("beforeend", fps_element);
};
main();
