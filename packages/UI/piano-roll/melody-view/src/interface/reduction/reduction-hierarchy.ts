import { AudioReflectable } from "@music-analyzer/view";
import { IReductionLayer } from "./reduction-layer";
import { HierarchyLevelSubscriber } from "@music-analyzer/controllers";

export interface IReductionHierarchy
  extends
  IReductionLayer,
  HierarchyLevelSubscriber,
  AudioReflectable { }