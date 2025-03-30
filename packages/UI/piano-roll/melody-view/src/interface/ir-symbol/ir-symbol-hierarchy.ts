import { HierarchyLevelSubscriber } from "@music-analyzer/controllers";
import { AudioReflectable } from "@music-analyzer/view";
import { I_IRSymbolLayer } from "./ir-symbol-layer";

export interface I_IRSymbolHierarchy
  extends
  I_IRSymbolLayer,
  HierarchyLevelSubscriber,
  AudioReflectable { }