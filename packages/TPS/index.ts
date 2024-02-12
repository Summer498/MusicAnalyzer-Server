import { Math } from "../Math";
import {
  getIntervalDegree,
  getNonNullableChroma,
  RomanChord,
} from "../TonalEx";
import { assertNonNullable, Assertion, NotImplementedError } from "../StdLib";
import Scale_default from "@tonaljs/scale";
import { Chord } from "@tonaljs/chord";
import { Scale } from "@tonaljs/scale";
import Key_default from "@tonaljs/key";
import Note from "@tonaljs/note";
// eslint-disable-next-line @typescript-eslint/no-explicit-any

const regionDistanceInChromaNumber = (src: number, dst: number) => {
  return Math.abs(Math.mod((dst - src) * 7 + 6, 12) - 6);
};

export const regionDistance = (src: Scale, dst: Scale) => {
  const src_chroma = getNonNullableChroma(assertNonNullable(src.tonic));
  const dst_chroma = getNonNullableChroma(assertNonNullable(dst.tonic));

  const region_dist = regionDistanceInChromaNumber(src_chroma, dst_chroma);
  return region_dist;
};

const tonicDistanceInChromaNumber = (src: number, dst: number) => {
  return Math.abs(Math.mod((dst - src) * 3 + 3, 7) - 3);
};

export const tonicDistance = (src: Chord, dst: Chord) => {
  const interval = getIntervalDegree(
    assertNonNullable(src.tonic),
    assertNonNullable(dst.tonic),
  );
  const dist_in_circle_of_3rd = Math.mod((interval - 1) * 3, 7);
  return Math.min(dist_in_circle_of_3rd, 7 - dist_in_circle_of_3rd);
};

const getTonicChroma = (chord: Chord) => {
  const tonic = assertNonNullable(chord.tonic);
  return [getNonNullableChroma(tonic)];
};

const getPowerChroma = (chord: Chord) => {
  const tonic = assertNonNullable(chord.tonic);
  const fifths = chord.notes.filter(
    (note) => getIntervalDegree(tonic, note) == 5,
  );
  new Assertion(fifths.length == 1).onFailed(() => {
    console.log(`received:`);
    console.log(chord.notes);
    throw new Error("received chord must have just one 5th code.");
  });
  return [tonic, fifths[0]].map((note) => getNonNullableChroma(note));
};

const getChordChroma = (chord: Chord) => {
  return chord.notes.map((note) => getNonNullableChroma(note));
};

const getScaleChroma = (roman: RomanChord) => {
  // TODO: 借用和音に伴いスケール構成音を変異させる
  new Assertion(
    Math.isSubSet(
      roman.chord.notes.map((note) => getNonNullableChroma(note)),
      roman.scale.notes.map((note) => getNonNullableChroma(note)),
    ),
  ).onFailed(() => {
    console.log(`received:`);
    console.log(roman);
    throw new NotImplementedError(
      "借用和音はまだ実装されていません. 入力ローマ数字コードは, コード構成音がスケール内に収まるようにしてください.",
    );
  });
  return roman.scale.notes.map((note) => getNonNullableChroma(note));
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

  const basic_space = Math.vSum(
    Math.getOnehot(getTonicChroma(roman.chord), 12),
    Math.getOnehot(getPowerChroma(roman.chord), 12),
    Math.getOnehot(getChordChroma(roman.chord), 12),
    Math.getOnehot(getScaleChroma(roman), 12),
  );
  return basic_space;
};

export const basicSpaceDistance = (src: RomanChord, dst: RomanChord) => {
  const src_bs = getBasicSpace(src);
  const dst_bs = getBasicSpace(dst);
  const incremented = Math.vSub(dst_bs, src_bs).filter((e) => e > 0);
  return Math.totalSum(incremented);
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

const c_minor = Key_default.minorKey("C").natural;
type KeyScale = typeof c_minor;
const isKeyIncludesTheChord = (key: KeyScale, chord: Chord) => {
  const key_note_chromas = key.scale.map((note: any) => Note.chroma(note));
  const chord_note_chromas = chord.notes.map((note) => Note.chroma(note));
  return Math.isSuperSet(key_note_chromas, chord_note_chromas);
};

// 最も尤もらしいコード進行を見つける
const major_keys = [
  "Gb",
  "Db",
  "Ab",
  "Eb",
  "Bb",
  "F",
  "C",
  "G",
  "D",
  "A",
  "E",
  "B",
].map((key) => Scale_default.get(key + " major"));
const minor_keys = [
  "Eb",
  "Bb",
  "F",
  "C",
  "G",
  "D",
  "A",
  "E",
  "B",
  "F#",
  "C#",
  "G#",
].map((key) => Scale_default.get(key + " minor"));
const keys = major_keys.concat(minor_keys);
const chroma2symbol = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

// TODO: minor Major 7 を受け取ることがあるので, 任意のキーを候補として使えるようにする.
export const getKeysIncludeTheChord = (chord: Chord) => {
  const keys_includes_the_chord = chroma2symbol
    .flatMap((symbol) => [
      Key_default.majorKey(symbol),
      Key_default.minorKey(symbol).natural,
    ])
    .filter((key) => isKeyIncludesTheChord(key, chord))
    .map((key) => Scale_default.get(key.chordScales[0]));
  return keys_includes_the_chord;
};

const getMostLikelyChordProgression = (chord_progression: string[]) => {
  /*
	const possible_keys = chord_progression.forEach(chord => getKeyIncludesTheChord(chord));
	return undefined;
	*/
};
