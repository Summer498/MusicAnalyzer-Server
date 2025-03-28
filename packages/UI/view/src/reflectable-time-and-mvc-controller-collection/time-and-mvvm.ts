import { MVVM_ViewModel } from "../mvvm/mvvm";
import { MVVM_View } from "../mvvm/view";
import { TimeAndMVCModel } from "./time-and-model";

export abstract class TimeAndVM<
  M extends TimeAndMVCModel,
  K extends keyof SVGElementTagNameMap
>
  extends MVVM_ViewModel<M, MVVM_View<K, M>> {
  abstract readonly model: M;
}
