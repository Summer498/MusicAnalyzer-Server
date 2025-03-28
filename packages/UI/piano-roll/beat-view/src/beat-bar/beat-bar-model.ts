import { BeatInfo } from "@music-analyzer/beat-estimation/src/beat-info";
import { Time } from "@music-analyzer/time-and/src/time";
import { MVVM_Model } from "@music-analyzer/view/src/mvvm/model";

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
