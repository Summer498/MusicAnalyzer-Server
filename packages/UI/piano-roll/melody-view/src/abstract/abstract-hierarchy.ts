import { CollectionHierarchy, I_CollectionLayer } from "@music-analyzer/view";

export abstract class Hierarchy<L extends I_CollectionLayer>
  extends CollectionHierarchy<L> {
  constructor(
    id:string,
    children: L[]
  ){
    super(id, children)
  }
}