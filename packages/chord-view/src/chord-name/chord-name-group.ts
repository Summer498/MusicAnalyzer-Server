import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { ChordNameController } from "./chord-name-controller";
import { ChordNameModel } from "./chord-name-model";
import { AccompanyToAudioRegistry, SvgCollection } from "@music-analyzer/view";

export class ChordNameGroup extends SvgCollection {
  constructor(
    romans: TimeAndRomanAnalysis[]
  ){
    const children = romans.map(e => new ChordNameController(new ChordNameModel(e)));
    super(children);
    this.svg.id = "chord-names";
    AccompanyToAudioRegistry.instance.register(this);
  }
}
