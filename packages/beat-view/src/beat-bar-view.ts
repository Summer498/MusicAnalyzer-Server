import { CurrentTimeX, NoteSize, NowAtX, PianoRollHeight } from "@music-analyzer/view-parameters";
import { BeatBarModel } from "./beat-bar-model";

export class BeatBarView {
  private readonly model: BeatBarModel;
  readonly svg: SVGLineElement;
  readonly y1: number;
  readonly y2: number;
  constructor(model: BeatBarModel){
    this.model = model;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.svg.id = "bar";
    this.svg.style.stroke = "#000";
    this.svg.style.display = "none";  //NOTE: 一旦非表示にしている
    this.y1 = 0;
    this.y2 = PianoRollHeight.value;
    this.updateY();
  }
  updateY() {
    this.svg.setAttribute("y1", `${this.y1}`);
    this.svg.setAttribute("y2", `${this.y2}`);
  }
  onAudioUpdate() {
    this.svg.setAttribute("x1", `${CurrentTimeX.value + this.model.begin * NoteSize.value - NowAtX.value}`);
    this.svg.setAttribute("x2", `${CurrentTimeX.value + this.model.begin * NoteSize.value - NowAtX.value}`);
  }
}

