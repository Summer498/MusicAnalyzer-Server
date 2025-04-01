import { AudioReflectableRegistry } from "@music-analyzer/view";
import { RequiredByIRSymbol } from "./required-by-ir-symbol";

export interface RequiredByIRSymbolLayer
  extends RequiredByIRSymbol {
  readonly audio: AudioReflectableRegistry
}
