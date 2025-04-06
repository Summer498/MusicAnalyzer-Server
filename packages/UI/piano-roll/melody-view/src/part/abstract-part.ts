import { I_MVVM_View, MVVM_Model, MVVM_ViewModel_Impl } from "@music-analyzer/view"

export abstract class Part<M extends MVVM_Model, V extends I_MVVM_View>
extends MVVM_ViewModel_Impl<M, V> {

}