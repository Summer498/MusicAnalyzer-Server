import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { AudioReflectableRegistry, ReflectableTimeAndMVCControllerCollection, WindowReflectableRegistry } from "@music-analyzer/view";
import { ChordName } from "./chord-name";
import { RequiredByChordName } from "./chord-name/chord-name";

export interface RequiredByChordNameSeries
  extends RequiredByChordName {
  readonly audio: AudioReflectableRegistry
}
export class ChordNameSeries
  extends ReflectableTimeAndMVCControllerCollection<ChordName> {
  constructor(
    romans: TimeAndRomanAnalysis[],
    controllers: RequiredByChordNameSeries,
  ) {
    super("chord-names", romans.map(e => new ChordName(e, controllers)));
    controllers.audio.register(this);
  }
}
