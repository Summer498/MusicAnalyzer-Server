import { HierarchyLevelSubscriber } from "@music-analyzer/controllers/src/slider/hierarchy-level/hierarchy-level-subscriber";
import { AudioReflectable } from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { IReductionLayer } from "./reduction-layer";

export interface IReductionHierarchy
  extends
  IReductionLayer,
  HierarchyLevelSubscriber,
  AudioReflectable { }