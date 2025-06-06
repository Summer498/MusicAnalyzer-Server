export const reservation_range = 1 / 15;  // play range [second]
export const bracket_height = 2;
export const size = 2;
export const octave_height = size * 84;  // 7 白鍵と 12 半音をきれいに描画するには 7 * 12 の倍数が良い
export const black_key_height = octave_height / 12;

export interface NowAt { get(): number; set(value: number): void; }
export const createNowAt = (initial = 0): NowAt => {
  let val = initial;
  return { get: () => val, set: (v: number) => { val = v; } };
};
export const NowAt = createNowAt();

export interface PianoRollRatio { get(): number; set(value: number): void; }
export const createPianoRollRatio = (initial = 1): PianoRollRatio => {
  let val = initial;
  return { get: () => val, set: (v: number) => { val = v; } };
};
export const PianoRollRatio = createPianoRollRatio();

interface PianoRollTimeLength { _get(): number }
const createPianoRollTimeLength = (
  ratio: PianoRollRatio,
  length: SongLength,
): PianoRollTimeLength => ({ _get: () => ratio.get() * length.get() });
const PianoRollTimeLength = {
  get: () => PianoRollRatio.get() * SongLength.get(),
};

export interface NoteSize { _get(): number }
export const createNoteSize = (
  width: PianoRollWidth,
  length: PianoRollTimeLength,
): NoteSize => ({ _get: () => width._get() / length._get() });
export const NoteSize = {
  get: () => PianoRollWidth.get() / PianoRollTimeLength.get(),
};

const transposed = (e: number) => e - PianoRollBegin.get();
const scaled = (e: number) => e * NoteSize.get();
const negated = (e: number) => -e;
const convertToCoordinate = (e: number) => e * black_key_height;
const replaceNNasInf = (e: number) => isNaN(e) ? -99 : e;

const midi2BlackCoordinate = (arg:number) => [
  transposed,
  convertToCoordinate,
  negated,
].reduce((c, f) => f(c), arg);

const midi2NNBlackCoordinate = (arg:number) => [
  midi2BlackCoordinate,
  replaceNNasInf,
].reduce((c, f) => f(c), arg);

export const PianoRollConverter = {
  midi2BlackCoordinate,
  midi2NNBlackCoordinate,
  transposed,
  scaled,
  convertToCoordinate,
} as const;

interface CurrentTimeRatio { get(): number; set(value: number): void; }
const createCurrentTimeRatio = (initial = 1 / 4): CurrentTimeRatio => {
  let val = initial;
  return { get: () => val, set: (v: number) => { val = v; } };
};
const CurrentTimeRatio = createCurrentTimeRatio();

export interface CurrentTimeX { _get(): number }
export const createCurrentTimeX = (
  width: PianoRollWidth,
  ratio: CurrentTimeRatio,
): CurrentTimeX => ({ _get: () => width._get() * ratio.get() });
export const CurrentTimeX = {
  get: () => PianoRollWidth.get() * CurrentTimeRatio.get(),
};
export interface OctaveCount { _get(): number }
export const createOctaveCount = (
  end: PianoRollEnd,
  begin: PianoRollBegin,
): OctaveCount => ({ _get: () => Math.ceil(-(end.value - begin.value) / 12) });
export const OctaveCount = {
  get: () => Math.ceil(-(PianoRollEnd.get() - PianoRollBegin.get()) / 12),
};
export interface PianoRollBegin { value: number }
export const createPianoRollBegin = (initial = 83): PianoRollBegin => {
  return { value: initial };
};
let pianoRollBeginValue = 83;
export const PianoRollBegin = {
  get: () => pianoRollBeginValue,
  set: (v: number) => { pianoRollBeginValue = v; },
};
export interface PianoRollEnd { value: number }
export const createPianoRollEnd = (initial = 83 + 24): PianoRollEnd => {
  return { value: initial };
};
let pianoRollEndValue = 83 + 24;
export const PianoRollEnd = {
  get: () => pianoRollEndValue,
  set: (v: number) => { pianoRollEndValue = v; },
};
export interface PianoRollHeight { _get(): number }
export const createPianoRollHeight = (count: OctaveCount): PianoRollHeight => ({
  _get: () => octave_height * count._get(),
});
export const PianoRollHeight = {
  get: () => octave_height * OctaveCount.get(),
};
class WindowInnerWidth {
  _get() { return window.innerWidth; }
  static get() { return window.innerWidth; }
}

export interface PianoRollWidth { _get(): number }
export const createPianoRollWidth = (): PianoRollWidth => ({
  _get: () => window.innerWidth - 48,
});
export const PianoRollWidth = {
  get: () => WindowInnerWidth.get() - 48,
};
interface SongLength { get(): number; set(value: number): void; }
const createSongLength = (initial = 0): SongLength => {
  let val = initial;
  return { get: () => val, set: (v: number) => { val = v; } };
};
const SongLength = createSongLength();

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
