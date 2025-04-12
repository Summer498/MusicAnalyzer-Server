import { ChordKey } from "../part";
import { RequiredByChordKeyModel } from "../r-model";
import { RequiredByChordKeySeries } from "../r-series";
import { ChordPartSeries } from "./chord-parts-series";

export class ChordKeySeries
  extends ChordPartSeries<ChordKey> {
  readonly remaining: ChordKey | undefined;
  constructor(
    romans: RequiredByChordKeyModel[],
    controllers: RequiredByChordKeySeries
  ) {
    super("key-names", controllers, romans.map(e => new ChordKey(e)));
  }
}
