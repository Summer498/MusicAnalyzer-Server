import { I_MVVM_Collection } from "../mvvm";
import { I_TimeAndVM } from "./i-time-and-model";
import { TimeAndMVCModel } from "./time-and-model";

export interface I_ReflectableTimeAndMVCControllerCollection
  extends I_MVVM_Collection {
  readonly show: I_TimeAndVM[];
  readonly children: I_TimeAndVM[];
  readonly children_model: TimeAndMVCModel[]
}
