export const reservation_range = 1 / 15;  // play range [second]
export const bracket_height = 2;
export const size = 2;
export const octave_height = size * 84;  // 7 白鍵と 12 半音をきれいに描画するには 7 * 12 の倍数が良い
export const black_key_height = octave_height / 12;

export interface NowAt { readonly value: number }
export const createNowAt = (value: number): NowAt => ({ value });

let nowAtValue = 0;
export const NowAt = {
  get: () => nowAtValue,
  set: (value: number) => { nowAtValue = value },
};
export interface PianoRollRatio { readonly value: number }
export const createPianoRollRatio = (value: number): PianoRollRatio => ({ value });
let pianoRollRatioValue: number = 1;
export const PianoRollRatio = {
  get: () => pianoRollRatioValue,
  set: (value: number) => { pianoRollRatioValue = value },
};
export interface NoteSize { get: () => number }
export const createNoteSize = (width: PianoRollWidth, length: PianoRollTimeLength): NoteSize => ({
  get: () => width.get() / length._get(),
});
export const NoteSize: NoteSize = {
  get: () => PianoRollWidth.get() / PianoRollTimeLength.get(),
};
export interface CurrentTimeX { get: () => number }
export const createCurrentTimeX = (width: PianoRollWidth, ratio: CurrentTimeRatio): CurrentTimeX => ({
  get: () => width.get() * ratio.value,
});

export const CurrentTimeX: CurrentTimeX = {
  get: () => PianoRollWidth.get() * CurrentTimeRatio.get(),
};
export interface OctaveCount { get: () => number }
export const createOctaveCount = (end: PianoRollEnd, begin: PianoRollBegin): OctaveCount => ({
  get: () => Math.ceil(-(end.value - begin.value) / 12),
});

export const OctaveCount: OctaveCount = {
  get: () => Math.ceil(-(PianoRollEnd.get() - PianoRollBegin.get()) / 12),
};
export interface PianoRollBegin { readonly value: number }
export const createPianoRollBegin = (value: number): PianoRollBegin => ({ value });

let pianoRollBeginValue = 83;
export const PianoRollBegin = {
  get: () => pianoRollBeginValue,
  set: (value: number) => { pianoRollBeginValue = value },
};
export interface PianoRollEnd { readonly value: number }
export const createPianoRollEnd = (value: number): PianoRollEnd => ({ value });

let pianoRollEndValue = 83 + 24;
export const PianoRollEnd = {
  get: () => pianoRollEndValue,
  set: (value: number) => { pianoRollEndValue = value },
};
export interface PianoRollHeight { get: () => number }
export const createPianoRollHeight = (count: OctaveCount): PianoRollHeight => ({
  get: () => octave_height * count.get(),
});

export const PianoRollHeight: PianoRollHeight = {
  get: () => octave_height * OctaveCount.get(),
};
export interface WindowInnerWidth { get: () => number }
export const createWindowInnerWidth = (): WindowInnerWidth => ({ get: () => window.innerWidth });

export const WindowInnerWidth: WindowInnerWidth = {
  get: () => window.innerWidth,
};

export interface PianoRollWidth { get: () => number }
export const createPianoRollWidth = (windowWidth: WindowInnerWidth): PianoRollWidth => ({
  get: () => windowWidth.get() - 48,
});

export const PianoRollWidth: PianoRollWidth = {
  get: () => WindowInnerWidth.get() - 48,
};
  get: () => width.get() * ratio.value,
});

export const CurrentTimeX: CurrentTimeX = {
  get: () => PianoRollWidth.get() * CurrentTimeRatio.get(),
};
export interface OctaveCount { get: () => number }
export const createOctaveCount = (end: PianoRollEnd, begin: PianoRollBegin): OctaveCount => ({
  get: () => Math.ceil(-(end.value - begin.value) / 12),
});

export const OctaveCount: OctaveCount = {
  get: () => Math.ceil(-(PianoRollEnd.get() - PianoRollBegin.get()) / 12),
};
export interface PianoRollBegin { readonly value: number }
export const createPianoRollBegin = (value: number): PianoRollBegin => ({ value });

let pianoRollBeginValue = 83;
export const PianoRollBegin = {
  get: () => pianoRollBeginValue,
  set: (value: number) => { pianoRollBeginValue = value },
};
export interface PianoRollEnd { readonly value: number }
export const createPianoRollEnd = (value: number): PianoRollEnd => ({ value });

let pianoRollEndValue = 83 + 24;
export const PianoRollEnd = {
  get: () => pianoRollEndValue,
  set: (value: number) => { pianoRollEndValue = value },
};
export interface PianoRollHeight { get: () => number }
export const createPianoRollHeight = (count: OctaveCount): PianoRollHeight => ({
  get: () => octave_height * count.get(),
});

export const PianoRollHeight: PianoRollHeight = {
  get: () => octave_height * OctaveCount.get(),
};
export interface WindowInnerWidth { get: () => number }
export const createWindowInnerWidth = (): WindowInnerWidth => ({ get: () => window.innerWidth });

export const WindowInnerWidth: WindowInnerWidth = {
  get: () => window.innerWidth,
};

export interface PianoRollWidth { get: () => number }
export const createPianoRollWidth = (windowWidth: WindowInnerWidth): PianoRollWidth => ({
  get: () => windowWidth.get() - 48,
});

export const PianoRollWidth: PianoRollWidth = {
  get: () => WindowInnerWidth.get() - 48,
};
class SongLength {
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
