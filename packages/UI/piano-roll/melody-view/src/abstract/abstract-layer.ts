import { CollectionLayer, I_TimeAndVM } from "@music-analyzer/view";

export abstract class Layer<P extends I_TimeAndVM>
  extends CollectionLayer<P> {
  constructor(
    layer: number,
    children: P[],
  ) {
    super(layer, children);
  }
}