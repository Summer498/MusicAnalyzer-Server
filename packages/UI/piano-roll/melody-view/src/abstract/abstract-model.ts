import { Time } from "@music-analyzer/time-and";
import { MVVM_Model } from "@music-analyzer/view";

export abstract class Model
extends MVVM_Model {
  constructor(
    readonly time: Time,
    readonly head: Time,
  ){
    super()
  }
}