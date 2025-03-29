import { IChordKeySeries } from "./i-chord-key-series";
import { ChordKey } from "./chord-key";
import { RequiredByChordKeySeries } from "./r-chord-key-series";
import { ChordPartSeries } from "./chord-parts-series";
import { RequiredByChordKeyModel } from "./r-chord-key-model";

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
