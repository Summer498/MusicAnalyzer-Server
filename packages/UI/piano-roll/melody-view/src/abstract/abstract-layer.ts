import { CollectionLayer, I_TimeAndVM } from "@music-analyzer/view";
import { I_Layer } from "./i-layer";

export abstract class Layer<P extends I_TimeAndVM>
  extends CollectionLayer<P>
  implements I_Layer {
  constructor(
    layer: number,
    children: P[],
  ) {
    super(layer, children);
  }
  abstract onWindowResized(): void
}