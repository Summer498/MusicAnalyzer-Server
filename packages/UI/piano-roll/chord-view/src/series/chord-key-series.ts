import { ChordKey } from "./facade/part";
import { ChordPartSeries } from "./chord-parts-series";
import { RequiredByChordKeyModel } from "./facade/r-model";
import { RequiredByChordKeySeries } from "./facade/r-series";
import { IChordKeySeries } from "./facade/i-series";

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
