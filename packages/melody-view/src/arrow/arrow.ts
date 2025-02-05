import { AccompanyToAudio } from "@music-analyzer/view";
import { ArrowModel } from "./arrow-model";
import { ArrowView } from "./arrow-view";


export class ArrowController implements AccompanyToAudio {
  readonly model: ArrowModel;
  readonly view: ArrowView;

  constructor(
    model: ArrowModel,
    fill: string,
    stroke: string,
  ) {
    this.model = model;
    this.view = new ArrowView(this.model, fill, stroke);
  }
  onAudioUpdate(){
    this.view.onAudioUpdate();
  }
}
