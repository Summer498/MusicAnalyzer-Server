import { ChordRoman } from "./part";
import { ChordPartSeries } from "./chord-parts-series";
import { RequiredByChordRomanModel } from "./r-model";
import { RequiredByChordRomanSeries } from "./r-series";
import { IChordRomanSeries } from "./i-series";

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
