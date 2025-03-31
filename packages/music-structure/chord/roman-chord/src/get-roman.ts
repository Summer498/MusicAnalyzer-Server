import { getChroma } from "./facade";
import { getInterval } from "./facade";
import { getRomanNumeral } from "./facade";
import { intervalOf } from "./facade";
import { Chord } from "./facade";
import { Scale } from "./facade";

export const get_roman = (chord: Chord, scale: Scale) => {
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
