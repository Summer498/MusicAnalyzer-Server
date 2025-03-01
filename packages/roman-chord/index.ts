import { _RomanNumeral, _Chord, _Interval, _Note, _Scale, Chord, Scale } from "@music-analyzer/tonal-objects";

const get_roman = (scale: Scale, chord: Chord) => {
  // chord.tonic || _throw(TypeError("chord.tonic should not be null"));  // NOTE: chord.tonic を null にするテストケースを思いつかないので(=無さそうなので)コメントアウト
  if (chord.tonic === null || scale.tonic === null) {  // NOTE: tonic が空の場合, ローマ数字分析ができないのでとりあえずコードをそのまま返す
    return chord.name;
  }
  const tonic = chord.tonic;
  const true_tonic = scale.notes.find(e => _Note.chroma(e) === _Note.chroma(tonic));
  const interval = _Interval.distance(scale.tonic, true_tonic!);
  // const interval = _Interval.distance(scale.tonic, tonic);
  const roman = _RomanNumeral.get(_Interval.get(interval));
  return roman.roman + " " + chord.type;
};

export class RomanChord {
  readonly roman: string;
  constructor(
    readonly scale: Scale,
    readonly chord: Chord,
  ) {
    this.roman = get_roman(scale, chord);
  }
}
