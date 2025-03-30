import { ReflectableTimeAndMVCControllerCollection } from "./reflectable-time-and-mvc-controller-collection";
import { I_TimeAndVM } from "./reflectable-time-and-mvc-controller-collection";
import { I_CollectionLayer } from "./i-collection-layer";


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
