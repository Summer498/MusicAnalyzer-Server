export const reservation_range = 1 / 15;  // play range [second]
export const bracket_height = 2;
export const size = 2;
export const octave_height = size * 84;  // 7 白鍵と 12 半音をきれいに描画するには 7 * 12 の倍数が良い
export const black_key_height = octave_height / 12;

export class NowAt {
  constructor(readonly value: number) { }

  static #value = 0;
  static get() { return this.#value; }
  static set(value: number) { this.#value = value; }
}

export class PianoRollRatio {
  constructor(readonly value: number) { }

  static #value: number = 1;
  static get() { return this.#value; }
  static set(value: number) { this.#value = value; }
}

class PianoRollTimeLength {
  constructor(
    private readonly ratio: PianoRollRatio,
    private readonly length: SongLength,
  ) { }
  _get() { return this.ratio.value * this.length.value }

  static get() { return PianoRollRatio.get() * SongLength.get(); }
}


export class NoteSize {
  constructor(
    private readonly width: PianoRollWidth,
    private readonly length: PianoRollTimeLength,
  ) { }
  _get() { return this.width._get() / this.length._get(); }

  static get() { return PianoRollWidth.get() / PianoRollTimeLength.get(); }
}

export const PianoRollConverter = {
   transposed: (e: number) => e - PianoRollBegin.get(),
   scaled: (e: number) => e * NoteSize.get(),
   convertToCoordinate: (e: number) => e * black_key_height,
} as const;

class CurrentTimeRatio {
  constructor(readonly value: number) { };

  static #value = 1 / 4;
  static get() { return this.#value; }
  static set(value: number) { this.#value = value; }
}

export abstract class RectParameters {
  static readonly width: number;
  static readonly height: number;
}

export class CurrentTimeX {
  constructor(
    private readonly width: PianoRollWidth,
    private readonly ratio: CurrentTimeRatio,
  ) { }
  _get() { return this.width._get() * this.ratio.value; }

  static get() {
    return PianoRollWidth.get() * CurrentTimeRatio.get();
  }
}
export class OctaveCount {
  constructor(
    private readonly end: PianoRollEnd,
    private readonly begin: PianoRollBegin,
  ) { }
  _get() { return Math.ceil(-(this.end.value - this.begin.value) / 12); }

  static get() { return Math.ceil(-(PianoRollEnd.get() - PianoRollBegin.get()) / 12); }
}
export class PianoRollBegin {
  constructor(readonly value: number) { }

  static #value = 83;
  static get() { return this.#value; }
  static set(value: number) { this.#value = value; }
}
export class PianoRollEnd {
  constructor(readonly value: number) { }

  static #value = 83 + 24;
  static get() { return this.#value; }
  static set(value: number) { this.#value = value; }
}
export class PianoRollHeight {
  constructor(
    private readonly count: OctaveCount
  ) { }
  _get() { return octave_height * this.count._get(); }

  static get() { return octave_height * OctaveCount.get(); }
}
class WindowInnerWidth {
  _get() { return window.innerWidth; }
  static get() { return window.innerWidth; }
}

export class PianoRollWidth {
  _get() { return window.innerWidth - 48; }
  static get() { return WindowInnerWidth.get() - 48; }
}
export class SongLength {
  constructor(readonly value: number) { }

  static #value: number = 0;
  static get() { return this.#value; }
  static set(value: number) { this.#value = value; }
}

export const setCurrentTimeRatio = (e: number) => { CurrentTimeRatio.set(e) }

export const setPianoRollParameters = (
  hierarchical_melody: {
    readonly time: {
      begin: number,
      end: number,
    },
    readonly note: number,
  }[][],
) => {
  const last = <T>(arr: T[]) => arr[arr.length - 1];
  const melody = last(hierarchical_melody);

  const song_length = melody.reduce((p, c) => p.time.end > p.time.end ? p : c).time.end * 1.05;
  const highest_pitch = melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note > c.note ? p : c).note || 0;
  const lowest_pitch = melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note < c.note ? p : c).note || 0;
  SongLength.set(song_length)
  PianoRollEnd.set(lowest_pitch - 3);
  PianoRollBegin.set(
    [hierarchical_melody.length]
      .map(e => e * bracket_height)
      .map(e => e / 12)
      .map(e => Math.floor(e))
      .map(e => e * 12)
      .map(e => e + highest_pitch)
      .map(e => e + 12)[0]
  )
}
