import { ChordName } from "./part";
import { ChordPartSeries } from "./chord-parts-series";
import { RequiredByChordNameModel } from "./r-model";
import { RequiredByChordNameSeries } from "./r-series";
import { IChordNameSeries } from "./i-series";

export class ChordNameSeries
  extends ChordPartSeries<ChordName>
  implements IChordNameSeries {
  constructor(
    romans: RequiredByChordNameModel[],
    controllers: RequiredByChordNameSeries,
  ) {
    super("chord-names", controllers, romans.map(e => new ChordName(e)));
  }
}
