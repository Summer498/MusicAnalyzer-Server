import { HierarchyLevelSubscriber } from "@music-analyzer/controllers";
import { AudioReflectable } from "@music-analyzer/view";

export interface IHierarchy
  extends HierarchyLevelSubscriber,
  AudioReflectable { }