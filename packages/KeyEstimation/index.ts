import { _RomanNumeral, _Chord, _Interval, _Note, _Scale, Chord, Scale, getIntervalDegree } from "../TonalObjects";
import { dynamicLogViterbi, findMin } from "../Graph";
import { getZeros } from "../Math";
import { _throw, Assertion, assertNonNullable as NN, IdDictionary } from "../StdLib";
import { getDistance, getKeysIncludeTheChord } from "../TPS";

const get_roman = (scale: Scale, chord: Chord) => {
  // TODO: 確認しておく: もしかしたら # b がないものだけ出力されるバグがあるかもしれない
  // IV# が IV として出力されるなど?
  // 成功: C# Db 混同バグは直してある.
  chord.tonic || _throw(TypeError("chord.tonic should not be null"));
  const tonic = chord.tonic!;
  const true_tonic = scale.notes.find(e => _Note.chroma(e) === _Note.chroma(tonic));
  console.error(JSON.stringify(scale));
  console.error(scale.notes.map(e => e));
  console.error(scale.notes.map(e => _Note.chroma(e)));
  console.error(JSON.stringify(chord));
  console.error(tonic);
  console.error(_Note.chroma(tonic));
  console.error(scale.tonic);
  console.error(true_tonic);

  const interval = _Interval.distance(
    NN(scale.tonic),
    NN(true_tonic),
  );
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
  #chord_dictionary: IdDictionary<string>;
  #scale_dictionary: IdDictionary<string>;
  #setDictionary(lead_sheet_chords: string[]) {
    for (const chord_str of lead_sheet_chords) {
      const chord = getChord(chord_str);
      const candidate_scales = getKeysIncludeTheChord(chord);

      for (const scale of candidate_scales) {
        this.#chord_dictionary.register(chord.name);
        this.#scale_dictionary.register(scale.name);
      }
      if (candidate_scales.length === 0) {
        this.#scale_dictionary.register(_Scale.get("").name);
      }
    }
  }
  // returns all field
  debug() {
    return {
      lead_sheet_chords: this.lead_sheet_chords,
      chord_dict: this.#chord_dictionary.showAll(),
      scale_dict: this.#scale_dictionary.showAll(),
    };
  }
  constructor(lead_sheet_chords: string[]) {
    this.#chord_dictionary = new IdDictionary<string>();
    this.#scale_dictionary = new IdDictionary<string>();
    this.lead_sheet_chords = lead_sheet_chords.map(e => getChord(e).name);
    this.#setDictionary(this.lead_sheet_chords);
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
    const viterbi = dynamicLogViterbi(
      this.getStatesOnTime.bind(this),
      [0],
      this.getDistanceOfStates.bind(this),
      e => 0,
      this.lead_sheet_chords,
      findMin,
    );
    const trace = viterbi.trace;
    console.error(trace);
    return trace.map(e => e.map((scale, i) => new RomanChord(
      scale,
      _Chord.get(this.lead_sheet_chords[i]),
    )));
  }
}
