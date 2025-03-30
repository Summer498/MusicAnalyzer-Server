import { ChordRoman } from "./facade/part";
import { ChordPartSeries } from "./chord-parts-series";
import { RequiredByChordRomanModel } from "./facade/r-model";
import { RequiredByChordRomanSeries } from "./facade/r-series";
import { IChordRomanSeries } from "./facade/i-series";

export class ChordRomanSeries
  extends ChordPartSeries<ChordRoman>
  implements IChordRomanSeries {
  constructor(
    romans: RequiredByChordRomanModel[],
    controllers: RequiredByChordRomanSeries,
  ) {
    super("roman-names", controllers, romans.map(e => new ChordRoman(e)));
  }
}
