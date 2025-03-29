import { MVVM_ViewModel_Impl } from "../mvvm/mvvm-impl";
import { MVVM_View_Impl } from "../mvvm/view-impl";
import { TimeAndMVCModel } from "./time-and-model";

export abstract class TimeAndVM<
  M extends TimeAndMVCModel,
  K extends keyof SVGElementTagNameMap
>
  extends MVVM_ViewModel_Impl<M, MVVM_View_Impl<K, M>> {
  abstract readonly model: M;
}
