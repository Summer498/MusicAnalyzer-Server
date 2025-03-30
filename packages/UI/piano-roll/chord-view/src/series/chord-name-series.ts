import { ChordName } from "./facade/part";
import { ChordPartSeries } from "./chord-parts-series";
import { RequiredByChordNameModel } from "./facade/r-model";
import { RequiredByChordNameSeries } from "./facade/r-series";
import { IChordNameSeries } from "./facade/i-series";

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
