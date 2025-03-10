import { NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { MVVM_View } from "@music-analyzer/view";
import { BeatBarModel } from "./beat-bar-model";

export class BeatBarView extends MVVM_View<BeatBarModel, "line"> {
  readonly y1: number;
  readonly y2: number;
  constructor(model: BeatBarModel) {
    super(model, "line");
    this.svg.id = "bar";
    this.svg.style.stroke = "rgb(0, 0, 0)";
    this.svg.style.display = "none";  //NOTE: 一旦非表示にしている
    this.y1 = 0;
    this.y2 = PianoRollHeight.value;
    this.updateX();
    this.updateY();
  }
  updateX() {
    this.svg.setAttribute("x1", String(this.model.time.begin * NoteSize.value));
    this.svg.setAttribute("x2", String(this.model.time.begin * NoteSize.value));

  }
  updateY() {
    this.svg.setAttribute("y1", String(this.y1));
    this.svg.setAttribute("y2", String(this.y2));
  }
  onWindowResized() {
    this.updateX();
  }
}
