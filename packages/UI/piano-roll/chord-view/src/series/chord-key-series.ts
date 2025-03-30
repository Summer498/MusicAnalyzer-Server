import { ChordKey } from "./facade";
import { ChordPartSeries } from "./chord-parts-series";
import { RequiredByChordKeyModel } from "./facade";
import { RequiredByChordKeySeries } from "./facade";
import { IChordKeySeries } from "./facade";

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
