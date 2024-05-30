import { _RomanNumeral, _Chord, _Interval, _Note, _Scale, Chord, Scale, getIntervalDegree } from "../TonalObjects";
import { Compare } from "../Math";
import { dynamicLogViterbi } from "../Graph";
import { _throw, Assertion, assertNonNullable as NN } from "../StdLib";
import { getDistance, getKeysIncludeTheChord } from "../TPS";

const get_roman = (scale: Scale, chord: Chord) => {
  // TODO: fix: Vb が V として出力される
  chord.tonic || _throw(TypeError("chord.tonic should not be null"));
  const tonic = chord.tonic!;
  // const true_tonic = scale.notes.find(e => _Note.chroma(e) === _Note.chroma(tonic));
  // const interval = _Interval.distance(NN(scale.tonic), NN(true_tonic));
  const interval = _Interval.distance(NN(scale.tonic), NN(tonic));
  const roman = _RomanNumeral.get(_Interval.get(interval));
  return roman.roman + " " + chord.type;
};

export class RomanChord {
  scale: Scale;
  chord: Chord;
  roman: string;
  constructor(scale: Scale, chord: Chord) {
    this.scale = scale;
    this.chord = chord;
    this.roman = get_roman(scale, chord);
  }
}

const getBodyAndRoot = (chord_string: string) => {
  chord_string = chord_string.replace("minor/major", "XXXXXXXXXXX");
  let separator = "/";
  let before_separator = chord_string.indexOf(separator);
  if (before_separator < 0) {
    separator = " on ";
    before_separator = chord_string.indexOf(separator);
  }
  chord_string = chord_string.replace("XXXXXXXXXXX", "minor/major");

  const body_length = before_separator >= 0 ? before_separator : chord_string.length;
  const body = chord_string.slice(0, body_length);
  const root = chord_string.slice(body_length + separator.length);
  return { body, root };
};

// ルート付きコードが入力されてもコードを得られるようにする.
export const getChord = (chord_string: string): Chord => {
  const body_and_root = getBodyAndRoot(chord_string);
  const root = body_and_root.root;
  const chord = _Chord.get(body_and_root.body);
  if (chord_string === "") { return chord; }
  new Assertion(chord.tonic != null).onFailed(() => {
    console.log("received:");
    console.log(chord);
    throw new TypeError("tonic must not be null");
  });
  new Assertion(!chord.empty).onFailed(() => {
    console.log("received:");
    console.log(chord);
    throw Error('Illegal chord symbol "' + chord_string + '" received');
  });
  if (root != "" && !chord.notes.includes(root)) {
    // TODO: 現在はベース音をプッシュすると同じ(に見える)コードに対して候補が変化するように見えてしまう
    // ベース音を含むといろいろなコードが想定できるので, 候補スケールとして任意のスケールを使えるようにする
    chord.name += ` on ${root}`;
    chord.notes.push(root);
    chord.symbol += `/${root}`;
  }
  chord.root = root;
  chord.rootDegree = getIntervalDegree(chord.tonic!, chord.root);
  return chord;
};

export class ChordProgression {
  lead_sheet_chords: string[];
  // returns all member
  debug() {
    return {
      lead_sheet_chords: this.lead_sheet_chords,
    };
  }

  constructor(lead_sheet_chords: string[]) {
    this.lead_sheet_chords = lead_sheet_chords.map(e => getChord(e).name);
  }
  getStatesOnTime(t: number) {
    const chord = getChord(this.lead_sheet_chords[t]);
    const candidate_scales = getKeysIncludeTheChord(chord); // 候補がない時, ここが空配列になる
    if (candidate_scales.length === 0) {
      return [_Scale.get("")];
    }
    return candidate_scales;
  }

  getDistanceOfStates(t1: number, t2: number, scale1: Scale, scale2: Scale) {
    if (scale1.empty) {
      console.warn("empty scale received");
      return 0;
    }
    if (scale2.empty) {
      console.warn("empty scale received");
      return 0;
    }
    return getDistance(
      new RomanChord(scale1, getChord(this.lead_sheet_chords[t1])),
      new RomanChord(scale2, getChord(this.lead_sheet_chords[t2])),
    );
  }

  getMinimumPath() {
    return dynamicLogViterbi(
      this.getStatesOnTime.bind(this),
      [],
      this.getDistanceOfStates.bind(this),
      e => 0,
      this.lead_sheet_chords,
      Compare.findMin,
    ).trace.map((e, i) => e.map(scale => new RomanChord(
      scale,
      _Chord.get(this.lead_sheet_chords[i]),
    )));
  }
}
