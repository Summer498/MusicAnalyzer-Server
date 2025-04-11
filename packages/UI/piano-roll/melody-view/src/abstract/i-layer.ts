import { I_CollectionLayer } from "@music-analyzer/view";

export interface I_Layer
  extends I_CollectionLayer {
  onWindowResized(): void
}