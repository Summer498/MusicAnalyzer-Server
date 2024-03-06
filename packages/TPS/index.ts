import { getOnehot, isSubSet, isSuperSet, mod, totalSum, vSub, vSum } from "../Math";
import { _Note, _Scale, _Key, getIntervalDegree, getChroma, Chord, Scale } from "../TonalObjects";
import { RomanChord } from "../KeyEstimation";
import { assertNonNullable as NN, Assertion, NotImplementedError } from "../StdLib";
// eslint-disable-next-line @typescript-eslint/no-explicit-any

const regionDistanceInChromaNumber = (src: number, dst: number) => Math.abs(mod((dst - src) * 7 + 6, 12) - 6);

export const regionDistance = (src: Scale, dst: Scale) => {
  const src_chroma = getChroma(src.tonic);
  const dst_chroma = getChroma(dst.tonic);

  const region_dist = regionDistanceInChromaNumber(src_chroma, dst_chroma);
  return region_dist;
};

const _tonicDistanceInChromaNumber = (src: number, dst: number) => Math.abs(mod((dst - src) * 3 + 3, 7) - 3);

export const tonicDistance = (src: Chord, dst: Chord) => {
  const interval = getIntervalDegree(
    NN(src.tonic),
    NN(dst.tonic),
  );
  const dist_in_circle_of_3rd = mod((interval - 1) * 3, 7);
  return Math.min(dist_in_circle_of_3rd, 7 - dist_in_circle_of_3rd);
};

const getTonicChroma = (chord: Chord) => [getChroma(chord.tonic)];

const getPowerChroma = (chord: Chord) => {
  const tonic = NN(chord.tonic);
  const fifths = chord.notes.filter(note => getIntervalDegree(tonic, note) == 5);
  new Assertion(fifths.length == 1).onFailed(() => {
    console.log(`received:`);
    console.log(chord.notes);
    throw new Error("received chord must have just one 5th code.");
  });
  return [tonic, fifths[0]].map(note => getChroma(note));
};

const getChordChroma = (chord: Chord) => chord.notes.map(note => getChroma(note));

const getScaleChroma = (roman: RomanChord) => {
  // TODO: 借用和音に伴いスケール構成音を変異させる
  new Assertion(
    isSubSet(
      roman.chord.notes.map(note => getChroma(note)),
      roman.scale.notes.map(note => getChroma(note)),
    ),
  ).onFailed(() => {
    console.log(`received:`);
    console.log(roman);
    throw new NotImplementedError("借用和音はまだ実装されていません. 入力ローマ数字コードは, コード構成音がスケール内に収まるようにしてください.");
  });
  return roman.scale.notes.map(note => getChroma(note));
};

export const getBasicSpace = (roman: RomanChord) => {
  new Assertion(!roman.scale.empty).onFailed(() => {
    console.log(`received:`);
    console.log(roman.scale);
    throw new Error("scale must not be empty");
  });
  new Assertion(!roman.chord.empty).onFailed(() => {
    console.log(`received:`);
    console.log(roman.chord);
    throw new Error("chord must not be empty");
  });

  const basic_space = vSum(
    getOnehot(getTonicChroma(roman.chord), 12),
    getOnehot(getPowerChroma(roman.chord), 12),
    getOnehot(getChordChroma(roman.chord), 12),
    getOnehot(getScaleChroma(roman), 12),
  );
  return basic_space;
};

export const basicSpaceDistance = (src: RomanChord, dst: RomanChord) => {
  const src_bs = getBasicSpace(src);
  const dst_bs = getBasicSpace(dst);
  const incremented = vSub(dst_bs, src_bs).filter(e => e > 0);
  return totalSum(incremented);
  // TODO: 遠隔調の例外処理 (がそもそも必要なのか?)
};

export const getDistance = (
  src_chord_string: RomanChord,
  dst_chord_string: RomanChord,
): number => {
  const src = src_chord_string;
  const dst = dst_chord_string;
  const region_dist = regionDistance(src.scale, dst.scale);
  const tonic_dist = tonicDistance(src.chord, dst.chord);
  const basic_space_dist = basicSpaceDistance(src, dst);
  return region_dist + tonic_dist + basic_space_dist; //dummy
};

const c_minor = _Key.minorKey("C").natural;
type KeyScale = typeof c_minor;
const isKeyIncludesTheChord = (key: KeyScale, chord: Chord) => {
  const key_note_chromas = key.scale.map(note => _Note.chroma(note));
  const chord_note_chromas = chord.notes.map(note => _Note.chroma(note));
  return isSuperSet(key_note_chromas, chord_note_chromas);
};

// 最も尤もらしいコード進行を見つける
const chroma2symbol = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B",];

// TODO: minor Major 7 を受け取ることがあるので, 任意のキーを候補として使えるようにする.
// NOTE: major キーのみ受け取るようにしている
export const getKeysIncludeTheChord = (chord: Chord) => {
  const keys_includes_the_chord = chroma2symbol
    .flatMap(symbol => [
      _Key.majorKey(symbol),
      // _Key.minorKey(symbol).natural,
    ])
    .filter(key => isKeyIncludesTheChord(key, chord))
    .map(key => _Scale.get(key.chordScales[0]));
  return keys_includes_the_chord;
};

