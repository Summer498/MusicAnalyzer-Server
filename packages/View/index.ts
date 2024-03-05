import { TimeAnd, search_items_overlaps_range } from "../timeAnd";
import { SVG } from "../HTML";
import { getRange, vAdd, vMod } from "../Math";

export interface TimeAndSVGs<T extends SVGElement> extends TimeAnd { svg: T; }

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
export const size = 2;
export const getPianoRollWidth = () => window.innerWidth - 48;  // innerWidth が動的に変化する
export const octave_height = size * 84;  // 7 白鍵と 12 半音をきれいに描画するには 7 * 12 の倍数が良い
export const octave_cnt = 3;
export const piano_roll_begin = 83;
export const white_key_prm = new RectParameters({ width: 36, height: octave_height / 7, fill: "#fff", stroke: "#000", });
export const black_key_prm = new RectParameters({ width: white_key_prm.width * 2 / 3, height: octave_height / 12, fill: "#444", stroke: "#000", });
export const white_bgs_prm = new RectParameters({ width: getPianoRollWidth(), height: octave_height / 12, fill: "#eee", stroke: "#000", });
export const black_bgs_prm = new RectParameters({ width: getPianoRollWidth(), height: octave_height / 12, fill: "#ccc", stroke: "#000", });

export const piano_roll_height = octave_height * octave_cnt;
export const black_position = vMod(vAdd([2, 4, 6, 9, 11], piano_roll_begin), 12);
export const white_position = getRange(0, 12).filter(e => !black_position.includes(e));
export const piano_roll_time_length = 5;  // 1 画面に収める曲の長さ[秒]

export const reservation_range = 1 / 15;  // play range [second]

export class SvgWindow<T extends SVGElement, U extends TimeAndSVGs<T>> {
  readonly all: U[];
  readonly show: U[];
  readonly group: SVGGElement;
  readonly update: (current_time_x: number, now_at: number, note_size: number) => void;
  constructor(name: string, all: U[], update: (e: U, current_time_x: number, now_at: number, note_size: number) => any) {
    this.all = all;
    this.show = [];//all.map(e => e);
    this.group = SVG.g({ name }, undefined, this.show.map(e => e.svg));
    this.update = (current_time, now_at, note_size) => this.show.forEach(e => update(e, current_time, now_at, note_size));
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

type RectAndParam = {
  svg: SVGRectElement,
  oct: number,
  y: number,
  width: number,
  height: number,
}

export const getWhiteBGs = () => [...Array(octave_cnt)].map((_, oct) =>
  [...Array(7)].map((_, j): RectAndParam => ({
    svg: SVG.rect({ name: "white-BG", fill: white_bgs_prm.fill, stroke: white_bgs_prm.stroke, }),
    oct,
    y: octave_height * oct + white_bgs_prm.height * white_position[j],
    width: white_bgs_prm.width,
    height: white_bgs_prm.height
  }))
).flat();

export const getBlackBGs = () => [...Array(octave_cnt)].map((_, oct) =>
  [...Array(5)].map((_, j): RectAndParam => ({
    svg: SVG.rect({ name: "black-BG", fill: black_bgs_prm.fill, stroke: black_bgs_prm.stroke, }),
    oct,
    y: octave_height * oct + black_bgs_prm.height * black_position[j],
    width: black_bgs_prm.width,
    height: black_bgs_prm.height
  }))
).flat();

export const getOctaveBGs = (white_BGs: RectAndParam[], black_BGs: RectAndParam[]) => [...Array(octave_cnt)].map((_, oct) => ({
  y: octave_height * oct,
  height: octave_height,
  oct,
  svg: SVG.g({ name: "octave-BG" }, undefined, [
    white_BGs.filter(e => e.oct === oct).map(e => e.svg),
    black_BGs.filter(e => e.oct === oct).map(e => e.svg)
  ])
}));


export const getWhiteKeys = () => [...Array(octave_cnt)].map((_, oct) =>
  [...Array(7)].map((_, j): RectAndParam => ({
    svg: SVG.rect({ name: "white-key", fill: white_key_prm.fill, stroke: white_key_prm.stroke, }),
    oct,
    y: octave_height * oct + white_key_prm.height * [0, 1, 2, 3, 4, 5, 6][j],
    width: white_key_prm.width,
    height: white_key_prm.height
  }))
).flat();

export const getBlackKeys = () => [...Array(octave_cnt)].map((_, oct) =>
  [...Array(5)].map((_, j): RectAndParam => ({
    svg: SVG.rect({ name: "black-key", fill: black_key_prm.fill, stroke: black_key_prm.stroke, }),
    oct,
    y: octave_height * oct + black_key_prm.height * black_position[j],
    width: black_key_prm.width,
    height: black_key_prm.height
  }))
).flat();

export const getOctaveKeys = (white_key: RectAndParam[], black_key: RectAndParam[]) => [...Array(octave_cnt)].map((_, oct) => ({
  y: octave_height * oct,
  height: octave_height,
  oct,
  svg: SVG.g({ name: "octave-key" }, undefined, [
    white_key.filter(e => e.oct === oct).map(e => e.svg),
    black_key.filter(e => e.oct === oct).map(e => e.svg)
  ])
}));