import { Time } from "@music-analyzer/time-and";
import { MVVM_Model } from "../mvvm";

export abstract class TimeAndMVCModel
  extends MVVM_Model {
  abstract readonly time: Time;
}
