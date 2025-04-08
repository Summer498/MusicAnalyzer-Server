import { I_MVVM_View, MVVM_Model, MVVM_ViewModel_Impl } from "@music-analyzer/view"
import { PianoRollConverter } from "@music-analyzer/view-parameters"

export abstract class Part<M extends MVVM_Model, V extends I_MVVM_View>
extends MVVM_ViewModel_Impl<M, V> {
  protected readonly converter: PianoRollConverter;
  constructor(
    model: M,
    view: V,
  ){
    super(model,view)
    this.converter = new PianoRollConverter();
  }
}
