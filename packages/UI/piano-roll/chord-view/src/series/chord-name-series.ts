import { ChordName } from "../part";
import { RequiredByChordNameModel } from "../r-model";
import { RequiredByChordNameSeries } from "../r-series";
import { ChordPartSeries } from "./chord-parts-series";

export class ChordNameSeries
  extends ChordPartSeries<ChordName> {
  constructor(
    romans: RequiredByChordNameModel[],
    controllers: RequiredByChordNameSeries,
  ) {
    super("chord-names", controllers, romans.map(e => new ChordName(e)));
  }
}
