import { Gravity, IMelodyModel } from "@music-analyzer/melody-analyze";
import { HierarchyLevel } from "@music-analyzer/controllers";
import { AccompanyToAudio } from "@music-analyzer/view";
import { ArrowModel } from "./arrow-model";
import { ArrowView } from "./arrow-view";


export class ArrowController implements AccompanyToAudio {
  readonly model: ArrowModel;
  readonly view: ArrowView;

  constructor(
    melody: IMelodyModel,
    next: IMelodyModel,
    gravity: Gravity,
    fill: string,
    stroke: string,
    hierarchy_level: HierarchyLevel,
    layer?: number
  ) {
    this.model = new ArrowModel(melody, next, gravity, hierarchy_level, layer);
    this.view = new ArrowView(this.model, fill, stroke);
  }
  onAudioUpdate(){
    this.view.onAudioUpdate();
  }
}
