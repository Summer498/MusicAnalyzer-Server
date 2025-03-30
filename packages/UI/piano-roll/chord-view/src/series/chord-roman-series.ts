import { ChordRoman } from "./facade";
import { ChordPartSeries } from "./chord-parts-series";
import { RequiredByChordRomanModel } from "./facade";
import { RequiredByChordRomanSeries } from "./facade";
import { IChordRomanSeries } from "./facade";

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
