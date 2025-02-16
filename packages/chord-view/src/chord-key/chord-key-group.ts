import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { AccompanyToAudioRegistry, SvgCollection } from "@music-analyzer/view";
import { ChordKeyController } from "./chord-key-controller";
import { ChordKeyModel } from "./chord-key-model";

export class CHordKeyGroup extends SvgCollection{
  constructor(
    romans: TimeAndRomanAnalysis[]
  ){
    const children = romans.map(e => new ChordKeyController(new ChordKeyModel(e)));
    super(children);
    this.svg.id = "key-names";
    AccompanyToAudioRegistry.instance.register(this);
  }
}
