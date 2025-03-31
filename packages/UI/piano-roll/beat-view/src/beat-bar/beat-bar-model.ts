import { BeatInfo } from "./facade";
import { Time } from "./facade";
import { MVVM_Model } from "./facade";

export class BeatBarModel 
  extends MVVM_Model {
  readonly time: Time;
  constructor(beat_info: BeatInfo, i: number) {
    super();
    this.time = new Time(
      i * 60 / beat_info.tempo,
      (i + 1) * 60 / beat_info.tempo
    );
  }
}
