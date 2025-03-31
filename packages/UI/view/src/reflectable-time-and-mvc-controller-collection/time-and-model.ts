import { Time } from "./facade";
import { MVVM_Model } from "../mvvm/model";

export abstract class TimeAndMVCModel
  extends MVVM_Model {
  abstract readonly time: Time;
}
