import { I_ReflectableTimeAndMVCControllerCollection } from "./reflectable-time-and-mvc-controller-collection/i-reflectable-time-and-mvc-controller-collection";
import { ReflectableTimeAndMVCControllerCollection } from "./reflectable-time-and-mvc-controller-collection/reflectable-time-and-mvc-controller-collection";
import { I_TimeAndVM } from "./reflectable-time-and-mvc-controller-collection/i-time-and-model";

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
