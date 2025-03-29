import { HierarchyLevelSubscriber } from "@music-analyzer/controllers/src/slider/hierarchy-level/hierarchy-level-subscriber";
import { AudioReflectable } from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { I_IRSymbolLayer } from "./ir-symbol-layer";

export interface I_IRSymbolHierarchy
  extends
  I_IRSymbolLayer,
  HierarchyLevelSubscriber,
  AudioReflectable { }