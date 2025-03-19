import { I_ReflectableTimeAndMVCControllerCollection, I_TimeAndVM, ReflectableTimeAndMVCControllerCollection } from "./svg-collection";

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
