import { AccompanyToAudio } from "@music-analyzer/view";
import { ArrowModel } from "./arrow-model";
import { ArrowView } from "./arrow-view";


export class ArrowController implements AccompanyToAudio {
  readonly model: ArrowModel;
  readonly view: ArrowView;

  constructor(
    model: ArrowModel,
  ) {
    this.model = model;
    this.view = new ArrowView(this.model);
  }
  onAudioUpdate(){
    this.view.onAudioUpdate();
  }
}
