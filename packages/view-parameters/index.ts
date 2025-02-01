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

// export const piano_roll_time_length = 5;  // 1 画面に収める曲の長さ[秒]
export class CurrentTimeRatio {
  static onChange: (() => void)[] = [];
  static #value = 1 / 4;
  static get value() { return this.#value; }
  static set value(value: number) {
    this.#value = value;
    this.onChange;
  }
}

export class PianoRollTimeLength {
  static #value = 5;
  static #song_length = 0;
  static #piano_roll_ratio = 1;
  static get value() { return this.#value; }
  static onChange() {
    this.#value = this.#piano_roll_ratio * this.#song_length;
    NoteSize.onChange();
  }
  static setSongLength(song_length: number) {
    if (song_length <= 0) { throw new EvalError("song_length should be positive"); }
    this.#song_length = song_length;
    this.onChange();
  }
  static setRatio(piano_roll_ratio: number) {
    this.#piano_roll_ratio = piano_roll_ratio;
    this.onChange();
  }
}
export class PianoRollWidth {
  static #value = window.innerWidth - 48;
  static get value() { return this.#value; }
  static onWindowResized() {
    PianoRollWidth.#value = window.innerWidth - 48;
  }
}
export class CurrentTimeX {
  static onUpdate: (() => void)[] = [];
  static #value = PianoRollWidth.value * CurrentTimeRatio.value;
  static get value() { return this.#value; }
  static onWindowResized() {
    this.#value = PianoRollWidth.value * CurrentTimeRatio.value;
    this.onUpdate.forEach(event => event());
  }
}
export class NoteSize {
  static onUpdate: (() => void)[] = [];
  static #value = PianoRollWidth.value / PianoRollTimeLength.value;
  static get value() { return this.#value; }
  static onChange() {
    this.#value = PianoRollWidth.value / PianoRollTimeLength.value;
    this.onUpdate.forEach(event => event());
  }
  static onWindowResized = this.onChange;
}
export class NowAt {
  static onUpdate: (() => void)[] = [];
  static #value = 0;
  static get value() { return this.#value; }
  static set value(value: number) {
    this.#value = value;
    this.onUpdate.forEach(event => event());
  }
}
// --- ピアノロールの描画パラメータ
export const size = 2;
// export const getPianoRollWidth = () => window.innerWidth - 48;  // innerWidth が動的に変化するpiano_roll_width
export const octave_height = size * 84;  // 7 白鍵と 12 半音をきれいに描画するには 7 * 12 の倍数が良い
export const white_key_prm = new RectParameters("#fff", "#000", 36, octave_height / 7);
export const black_key_prm = new RectParameters("#444", "#000", white_key_prm.width * 2 / 3, octave_height / 12);
export const white_bgs_prm = new RectParameters("#eee", "#000", PianoRollWidth.value, octave_height / 12);
export const black_bgs_prm = new RectParameters("#ccc", "#000", PianoRollWidth.value, octave_height / 12);

export class PianoRollHeight {
  static onUpdate: (() => void)[] = [];
  static #value = octave_height * 4;
  static get value() { return this.#value; }
  static set value(value: number) {
    this.#value = value;
    this.onUpdate.forEach(event => event());
  }
}

export class OctaveCount {
  static onUpdate: (() => void)[] = [
    () => { PianoRollHeight.value = octave_height * OctaveCount.value; }
  ];
  static #value = 4;
  static get value() { return this.#value; }
  static set value(value: number) {
    this.#value = value;
    console.log(`OctaveCount.value = ${OctaveCount.value}`);
    this.onUpdate.forEach(event => event());
  }
}

export class PianoRollBegin {
  static onUpdate: (() => void)[] = [];
  static #value = 83;
  static get value() { return this.#value; }
  static set value(value: number) {
    this.#value = value;
    this.onUpdate.forEach(event => event());
  }
}
export class PianoRollEnd {
  static onUpdate: (() => void)[] = [];
  static #value = 83 + 24;
  static get value() { return this.#value; }
  static set value(value: number) {
    this.#value = value;
    this.onUpdate.forEach(event => event());
  }
}
const updateOctaveCount = () => { OctaveCount.value = Math.ceil(-(PianoRollEnd.value - PianoRollBegin.value) / 12); };
PianoRollBegin.onUpdate.push(updateOctaveCount);
PianoRollEnd.onUpdate.push(updateOctaveCount);

export class BlackPosition {
  static get value() { return vMod(vAdd([2, 4, 6, 9, 11], PianoRollBegin.value), 12); }
}
export class WhitePosition {
  static get value() { return getRange(0, 12).filter(e => !BlackPosition.value.includes(e)); }
}

export const bracket_hight = 2;

export const reservation_range = 1 / 15;  // play range [second]
