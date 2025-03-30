import { ChordName } from "./facade";
import { ChordPartSeries } from "./chord-parts-series";
import { RequiredByChordNameModel } from "./facade";
import { RequiredByChordNameSeries } from "./facade";
import { IChordNameSeries } from "./facade";

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
