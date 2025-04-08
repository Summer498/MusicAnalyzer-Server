import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { RequiredByMelodyElements } from "./required-by-melody-elements";

export interface IHierarchyBuilder {
  readonly d_melody: SerializedTimeAndAnalyzedMelody[],
  readonly h_melodies: SerializedTimeAndAnalyzedMelody[][],
  readonly controllers: RequiredByMelodyElements & { audio: AudioReflectableRegistry, window: WindowReflectableRegistry },
}
