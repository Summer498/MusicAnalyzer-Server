import { I_ReflectableTimeAndMVCControllerCollection } from "./svg-collection";
import { I_TimeAndVM } from "./svg-collection";
import { ReflectableTimeAndMVCControllerCollection } from "./svg-collection";

export interface I_CollectionLayer
  extends I_ReflectableTimeAndMVCControllerCollection {
  readonly layer: number
}

export class CollectionLayer<VM extends I_TimeAndVM>
  extends ReflectableTimeAndMVCControllerCollection<VM>
  implements I_CollectionLayer {
  constructor(
    readonly layer: number,
    children: VM[],
  ) {
    super(`layer-${layer}`, children);
  }
}
