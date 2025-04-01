import { IChordRomanSeries } from "../i-series";
import { ChordRoman } from "../part";
import { RequiredByChordRomanModel } from "../r-model";
import { RequiredByChordRomanSeries } from "../r-series";
import { ChordPartSeries } from "./chord-parts-series";

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
