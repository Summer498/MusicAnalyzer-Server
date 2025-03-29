import { Time } from "@music-analyzer/time-and/src/time";
import { MVVM_Model } from "../mvvm/model";

export abstract class TimeAndMVCModel
  extends MVVM_Model {
  abstract readonly time: Time;
}
