import { HierarchyLevelSubscriber } from "./facade";
import { AudioReflectable } from "./facade";
import { I_IRSymbolLayer } from "./ir-symbol-layer";

export interface I_IRSymbolHierarchy
  extends
  I_IRSymbolLayer,
  HierarchyLevelSubscriber,
  AudioReflectable { }