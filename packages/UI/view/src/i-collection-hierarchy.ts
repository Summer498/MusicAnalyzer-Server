import { HierarchyLevelSubscriber } from "@music-analyzer/controllers/src/slider/hierarchy-level/hierarchy-level-subscriber"
import { I_MVVM_Collection } from "./mvvm/i-collection";
import { I_MVVM_ModelView } from "./mvvm/i-mvvm";

export interface ICollectionHierarchy
  extends
  I_MVVM_Collection,
  HierarchyLevelSubscriber {
    readonly children: I_MVVM_ModelView[];
}
