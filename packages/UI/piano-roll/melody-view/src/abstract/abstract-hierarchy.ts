import { CollectionHierarchy } from "@music-analyzer/view";
import { I_Layer } from "./i-layer";

export abstract class Hierarchy<L extends I_Layer>
  extends CollectionHierarchy<L> {
  constructor(
    id:string,
    children: L[]
  ){
    super(id, children)
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}