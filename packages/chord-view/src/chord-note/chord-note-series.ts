import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { ChordRomanController } from "../chord-roman/chord-roman-controller";
import { ChordRomanModel } from "../chord-roman/chord-roman-model";

export class ChordRomanSeries extends ReflectableTimeAndMVCControllerCollection {
  constructor(
    romans: TimeAndRomanAnalysis[]
  ){
    const children = romans.map(e => new ChordRomanController(new ChordRomanModel(e)));
    super(children);
    this.svg.id = "roman-names";
  }
} 
