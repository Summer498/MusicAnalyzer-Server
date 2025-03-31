import { HierarchyLevelSubscriber } from "./facade";
import { AudioReflectable } from "./facade";
import { IReductionLayer } from "./reduction-layer";

export interface IReductionHierarchy
  extends
  IReductionLayer,
  HierarchyLevelSubscriber,
  AudioReflectable { }