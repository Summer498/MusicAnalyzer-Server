import { I_MVVM_ModelView } from "../mvvm/i-mvvm";
import { TimeAndMVCModel } from "./time-and-model";

export interface I_TimeAndVM
  extends I_MVVM_ModelView {
  model: TimeAndMVCModel;
}