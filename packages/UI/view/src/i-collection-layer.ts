import { I_ReflectableTimeAndMVCControllerCollection } from "./reflectable-time-and-mvc-controller-collection"

export interface I_CollectionLayer
  extends I_ReflectableTimeAndMVCControllerCollection {
  readonly layer: number
}
