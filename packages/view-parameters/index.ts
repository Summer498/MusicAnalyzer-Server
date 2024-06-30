import { getRange, vAdd, vMod } from "@music-analyzer/math";

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
export class NowAt {
  static #value = 0;
  static get value() { return this.#value; }
  static onUpdate(now_at: number) {
    NowAt.#value = now_at;
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
