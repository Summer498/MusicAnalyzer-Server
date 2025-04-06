import { AudioReflectable } from "@music-analyzer/view";
import { I_IRSymbolLayer } from "../i-layer/i-ir-symbol-layer";
import { HierarchyLevelSubscriber } from "@music-analyzer/controllers";

export interface I_IRSymbolHierarchy
  extends
  I_IRSymbolLayer,
  HierarchyLevelSubscriber,
  AudioReflectable { }