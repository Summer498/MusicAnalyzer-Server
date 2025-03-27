import { getChord } from "@music-analyzer/tonal-objects/src/chord/get";
import { getChroma } from "@music-analyzer/tonal-objects/src/note/chroma";
import { getInterval } from "@music-analyzer/tonal-objects/src/interval/get";
import { getRomanNumeral } from "@music-analyzer/tonal-objects/src/roman-numeral/get";
import { intervalOf } from "@music-analyzer/tonal-objects/src/interval/distance";
import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { Scale } from "@music-analyzer/tonal-objects/src/scale/scale";

const get_roman = (chord: Chord, scale: Scale) => {
  // chord.tonic || _throw(TypeError("chord.tonic should not be null"));  // NOTE: chord.tonic を null にするテストケースを思いつかないので(=無さそうなので)コメントアウト
  if (chord.tonic === null || scale.tonic === null) {  // NOTE: tonic が空の場合, ローマ数字分析ができないのでとりあえずコードをそのまま返す
    return chord.name;
  }
  const tonic = chord.tonic;
  const true_tonic = scale.notes.find(e => getChroma(e) === getChroma(tonic));
  const interval = intervalOf(scale.tonic, true_tonic!);
  // const interval = _Interval.distance(scale.tonic, tonic);
  const roman = getRomanNumeral(getInterval(interval));
  return roman.roman + " " + chord.type;
};

const convertToTrueTonic = (chord: Chord, scale: Scale) => {
  if (chord.tonic) {
    const tonic = chord.tonic;
    const true_tonic = scale.notes.find(e => getChroma(e) === getChroma(tonic));
    if (true_tonic) {
      return getChord(chord.name.replace(tonic, true_tonic));
    }
  }
  return chord;
};

export class RomanChord {
  readonly roman: string;
  readonly chord: Chord;
  constructor(
    readonly scale: Scale,
    chord: Chord,
  ) {
    this.chord = convertToTrueTonic(chord, this.scale);
    this.roman = get_roman(this.chord, this.scale);
  }
}
