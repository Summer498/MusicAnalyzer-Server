import { AudioReflectableRegistry } from "./facade";
import { RequiredByIRSymbol } from "./required-by-ir-symbol";

export interface RequiredByIRSymbolLayer
  extends RequiredByIRSymbol {
  readonly audio: AudioReflectableRegistry
}
