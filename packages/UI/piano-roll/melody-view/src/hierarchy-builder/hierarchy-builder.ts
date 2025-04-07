import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { RequiredByMelodyElements } from "../required-by-melody-elements";
import { IHierarchyBuilder } from "./i-hierarchy-builder";
import { buildDMelody } from "./build-d-melody-series";
import { buildGravity } from "../gravity/build-gravity-hierarchy";
import { buildIRPlot } from "./build-ir-plot-svg";
import { buildIRSymbol } from "./build-ir-symbol-hierarchy";
import { buildMelody } from "./build-melody-hierarchy";
import { buildReduction } from "./build-reduction-hierarchy";

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
