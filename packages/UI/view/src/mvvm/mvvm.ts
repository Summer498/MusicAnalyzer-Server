import { I_MVVM_ModelView } from "./i-mvvm";
import { I_MVVM_View } from "./i-view";
import { MVVM_Model } from "./model";

export abstract class MVVM_ViewModel<
  M extends MVVM_Model,
  V extends I_MVVM_View,
> implements I_MVVM_ModelView {
  get svg() { return this.view.svg; }
  constructor(
    readonly model: M,
    protected readonly view: V,
  ) { }
}

