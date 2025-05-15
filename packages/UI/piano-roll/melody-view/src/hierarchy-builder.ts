import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { buildDMelody } from "./d-melody-series";
import { buildIRPlot } from "./ir-plot-svg";
import { buildIRSymbol } from "./ir-symbol-hierarchy";
import { buildMelody } from "./melody-hierarchy";
import { buildReduction } from "./reduction-hierarchy";
import { buildGravity } from "./gravity-hierarchy";
import { RequiredByMelodyElements } from "./required-by-melody-elements";

interface IHierarchyBuilder {
  readonly d_melody: SerializedTimeAndAnalyzedMelody[],
  readonly h_melodies: SerializedTimeAndAnalyzedMelody[][],
  readonly controllers: RequiredByMelodyElements,
}

export class HierarchyBuilder implements IHierarchyBuilder {
  constructor(
    readonly d_melody: SerializedTimeAndAnalyzedMelody[],
    readonly h_melodies: SerializedTimeAndAnalyzedMelody[][],
    readonly controllers: RequiredByMelodyElements & { audio: AudioReflectableRegistry, window: WindowReflectableRegistry },
  ) { }
  buildDMelody = buildDMelody
  buildGravity = buildGravity
  buildIRPlot = buildIRPlot
  buildIRSymbol = buildIRSymbol
  buildMelody = buildMelody
  buildReduction = buildReduction
}
