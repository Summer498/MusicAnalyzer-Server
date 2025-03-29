import { IChordNameSeries } from "./i-chord-name-series";
import { RequiredByChordNameSeries } from "./r-chord-name-series";
import { ChordName } from "./chord-name";
import { ChordPartSeries } from "./chord-parts-series";
import { RequiredByChordNameModel } from "./r-chord-name-model";

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
