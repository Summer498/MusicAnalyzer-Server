import { TimeAnd, search_items_overlaps_range } from "@music-analyzer/time-and";
import { SVG } from "@music-analyzer/html";
import { getRange, vAdd, vMod } from "@music-analyzer/math";

export interface TimeAndSVGs<T extends SVGElement> extends TimeAnd { svg: T; }

class RectParameters {
  readonly width;
  readonly height;
  readonly fill;
  readonly stroke;
  constructor(fill: string, stroke: string, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.fill = fill;
    this.stroke = stroke;
  }
}

export const piano_roll_time_length = 5;  // 1 画面に収める曲の長さ[秒]
export const current_time_ratio = 1 / 4;

export class PianoRollWidth {
  static #value = window.innerWidth - 48;
  static get value() { return this.#value; }
  static onWindowResized() {
    PianoRollWidth.#value = window.innerWidth - 48;
  }
}
export class CurrentTimeX {
  static #value = PianoRollWidth.value * current_time_ratio;
  static get value() { return this.#value; }
  static onWindowResized() {
    CurrentTimeX.#value = PianoRollWidth.value * current_time_ratio;
  }
}
export class NoteSize {
  static #value = PianoRollWidth.value / piano_roll_time_length;
  static get value() { return this.#value; }
  static onWindowResized() {
    NoteSize.#value = PianoRollWidth.value / piano_roll_time_length;
  }
}
// --- ピアノロールの描画パラメータ
export const size = 2;
// export const getPianoRollWidth = () => window.innerWidth - 48;  // innerWidth が動的に変化するpiano_roll_width
export const octave_height = size * 84;  // 7 白鍵と 12 半音をきれいに描画するには 7 * 12 の倍数が良い
export const octave_cnt = 3;
export const piano_roll_begin = 83;
export const white_key_prm = new RectParameters("#fff", "#000", 36, octave_height / 7);
export const black_key_prm = new RectParameters("#444", "#000", white_key_prm.width * 2 / 3, octave_height / 12);
export const white_bgs_prm = new RectParameters("#eee", "#000", PianoRollWidth.value, octave_height / 12);
export const black_bgs_prm = new RectParameters("#ccc", "#000", PianoRollWidth.value, octave_height / 12);

export const piano_roll_height = octave_height * octave_cnt;
export const black_position = vMod(vAdd([2, 4, 6, 9, 11], piano_roll_begin), 12);
export const white_position = getRange(0, 12).filter(e => !black_position.includes(e));

export const reservation_range = 1 / 15;  // play range [second]

export interface Updatable {
  updateShow: (begin: number, end: number) => void,
  onUpdate: (now_at: number) => void
}
export interface WindowReflectable {
  onWindowResized: () => void
}

export class UpdatableRegistry {
  private static _instance: UpdatableRegistry;
  private readonly registered: Updatable[];
  private constructor() { this.registered = []; }
  public static get instance() {
    return this._instance || (this._instance = new UpdatableRegistry());
  }
  register(updatable: Updatable) { this.registered.push(updatable); }
  onUpdate(now_at: number) {
    this.registered.forEach(e => {
      e.updateShow(
        now_at - piano_roll_time_length * current_time_ratio,
        now_at + piano_roll_time_length
      );
      e.onUpdate(now_at);
    });
  }
}

export class WindowReflectableRegistry {
  private static _instance: WindowReflectableRegistry;
  private readonly registered: WindowReflectable[];
  private constructor() { this.registered = []; }
  public static get instance() {
    return this._instance || (this._instance = new WindowReflectableRegistry());
  }
  register(updatable: WindowReflectable) { this.registered.push(updatable); }
  onWindowResized() {
    PianoRollWidth.onWindowResized();
    CurrentTimeX.onWindowResized();
    NoteSize.onWindowResized();

    this.registered.forEach(e => e.onWindowResized());
  }
}

export class SvgWindow<T extends SVGElement, U extends TimeAndSVGs<T>> implements Updatable {
  readonly all: U[];
  readonly show: U[];
  readonly group: SVGGElement;
  readonly onUpdate: (now_at: number) => void;
  constructor(name: string, all: U[], onUpdate: (e: U, now_at: number) => void) {
    this.all = all;
    this.show = [];
    this.group = SVG.g({ name }, undefined, this.show.map(e => e.svg));
    this.onUpdate = (now_at) => this.show.forEach(e => onUpdate(e, now_at));
    UpdatableRegistry.instance.register(this);  // TODO: 複数ファイルにコピーされてしまい updatable_registry の同一性が保証されず, 役に立たなくなる
  }
  updateShow(begin: number, end: number) {
    // const remain = search_items_in_range(this.show, begin, end);
    // this.show.splice(0, remain.begin_index).forEach(e=>this.group.removeChild(e.svg));  // 左側にはみ出したものを消す
    // this.show.splice(remain.end_index, this.show.length - remain.end_index).forEach(e=>this.group.removeChild(e.svg));  // 右側にはみ出したものを消す
    this.show.splice(0, this.show.length);  // 全部消す
    this.group.childNodes.forEach(e => this.group.removeChild(e));  // 全部消す
    const append = search_items_overlaps_range(this.all, begin - 5, end + 5);  // melodic gravity の矢印を隠すために ±5 のマージンを取る
    this.all.slice(append.begin_index, append.end_index).forEach(e => { this.show.push(e); this.group.appendChild(e.svg); });  // 必要分全部追加する
  }
}

class SvgAndParam {
  svg;
  oct;
  y;
  width;
  height;
  constructor(svg: SVGElement, oct: number, y: number, width: number, height: number) {
    this.svg = svg;
    this.oct = oct;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

export class SvgAndParams<T extends { svg: SVGElement }> implements WindowReflectable {
  svg;
  onWindowResized;
  constructor(svg_and_params: T[], onWindowResized: (e: T) => void) {
    this.svg = svg_and_params;
    this.onWindowResized = () => this.svg.forEach(e => onWindowResized(e));
    WindowReflectableRegistry.instance.register(this);
  }
}

export const getCurrentTimeLine = () => new SvgAndParams(
  [{
    svg: SVG.line({ name: "current_time", "stroke-width": 5, stroke: "#000" })
  }],
  e => e.svg.setAttributes({ x1: CurrentTimeX.value, x2: CurrentTimeX.value, y1: 0, y2: piano_roll_height })
);

export const getWhiteBGs = () => new SvgAndParams(
  [...Array(octave_cnt)].map((_, oct) =>
    [...Array(7)].map((_, j) => ({
      svg: SVG.rect({ name: "white-BG", fill: white_bgs_prm.fill, stroke: white_bgs_prm.stroke, }),
      oct,
      y: octave_height * oct + white_bgs_prm.height * white_position[j],
      width: white_bgs_prm.width,
      height: white_bgs_prm.height
    }))
  ).flat(),
  (e) => e.svg.setAttributes({ x: 0, y: e.y, width: PianoRollWidth.value, height: e.height })
);

export const getBlackBGs = () => new SvgAndParams(
  [...Array(octave_cnt)].map((_, oct) =>
    [...Array(5)].map((_, j) => ({
      svg: SVG.rect({ name: "black-BG", fill: black_bgs_prm.fill, stroke: black_bgs_prm.stroke, }),
      oct,
      y: octave_height * oct + black_bgs_prm.height * black_position[j],
      width: black_bgs_prm.width,
      height: black_bgs_prm.height
    }))
  ).flat(),
  (e) => e.svg.setAttributes({ x: 0, y: e.y, width: PianoRollWidth.value, height: e.height })
);

export const getOctaveBGs = (white_BGs: SvgAndParams<SvgAndParam>, black_BGs: SvgAndParams<SvgAndParam>) => new SvgAndParams(
  [...Array(octave_cnt)].map((_, oct) => ({
    svg: SVG.g({ name: "octave-BG" }, undefined, [
      white_BGs.svg.filter(e => e.oct === oct).map(e => e.svg),
      black_BGs.svg.filter(e => e.oct === oct).map(e => e.svg)
    ]),
    y: octave_height * oct,
    height: octave_height,
    oct,
    width: 0
  })),
  (e) => e.svg.setAttributes({ x: 0, y: e.y, width: PianoRollWidth.value, height: e.height })
);


export const getWhiteKeys = () => new SvgAndParams(
  [...Array(octave_cnt)].map((_, oct) =>
    [...Array(7)].map((_, j) => ({
      svg: SVG.rect({ name: "white-key", fill: white_key_prm.fill, stroke: white_key_prm.stroke, }),
      oct,
      y: octave_height * oct + white_key_prm.height * [0, 1, 2, 3, 4, 5, 6][j],
      width: white_key_prm.width,
      height: white_key_prm.height
    }))
  ).flat(),
  e => e.svg.setAttributes({ x: 0, y: e.y, width: e.width, height: e.height })
);

export const getBlackKeys = () => new SvgAndParams(
  [...Array(octave_cnt)].map((_, oct) =>
    [...Array(5)].map((_, j) => ({
      svg: SVG.rect({ name: "black-key", fill: black_key_prm.fill, stroke: black_key_prm.stroke, }),
      oct,
      y: octave_height * oct + black_key_prm.height * black_position[j],
      width: black_key_prm.width,
      height: black_key_prm.height
    }))
  ).flat(),
  e => e.svg.setAttributes({ x: 0, y: e.y, width: e.width, height: e.height })
);

export const getOctaveKeys = (white_key: SvgAndParams<SvgAndParam>, black_key: SvgAndParams<SvgAndParam>) =>
  new SvgAndParams(
    [...Array(octave_cnt)].map((_, oct) => ({
      svg: SVG.g({ name: "octave-key" }, undefined, [
        white_key.svg.filter(e => e.oct === oct).map(e => e.svg),
        black_key.svg.filter(e => e.oct === oct).map(e => e.svg)
      ]),
      y: octave_height * oct,
      height: octave_height,
      oct,
      width: 0
    })),
    (e) => e.svg.setAttributes({ x: 0, y: e.y, width: PianoRollWidth.value, height: e.height })
  );