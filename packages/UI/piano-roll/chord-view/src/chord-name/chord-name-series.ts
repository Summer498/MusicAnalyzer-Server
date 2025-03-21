import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { AudioReflectableRegistry, ReflectableTimeAndMVCControllerCollection, WindowReflectableRegistry } from "@music-analyzer/view";
import { ChordName } from "./chord-name";

export class ChordNameSeries 
  extends ReflectableTimeAndMVCControllerCollection<ChordName> {
  constructor(
    romans: TimeAndRomanAnalysis[],
    controllers: [AudioReflectableRegistry, WindowReflectableRegistry]
  ) {
    super("chord-names", romans.map(e => new ChordName(e, [controllers[1]])));
    controllers[0].register(this);
  }
}
