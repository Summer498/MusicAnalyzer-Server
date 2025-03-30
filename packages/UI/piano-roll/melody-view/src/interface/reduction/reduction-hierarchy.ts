import { HierarchyLevelSubscriber } from "@music-analyzer/controllers";
import { AudioReflectable } from "@music-analyzer/view";
import { IReductionLayer } from "./reduction-layer";

export interface IReductionHierarchy
  extends
  IReductionLayer,
  HierarchyLevelSubscriber,
  AudioReflectable { }