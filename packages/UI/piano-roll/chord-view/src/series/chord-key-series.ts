import { ChordKey } from "./part";
import { ChordPartSeries } from "./chord-parts-series";
import { RequiredByChordKeyModel } from "./r-model";
import { RequiredByChordKeySeries } from "./r-series";
import { IChordKeySeries } from "./i-series";

export class ChordKeySeries
  extends ChordPartSeries<ChordKey>
  implements IChordKeySeries {
  readonly remaining: ChordKey | undefined;
  constructor(
    romans: RequiredByChordKeyModel[],
    controllers: RequiredByChordKeySeries
  ) {
    super("key-names", controllers, romans.map(e => new ChordKey(e)));
  }
}
