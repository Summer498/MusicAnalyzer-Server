import { CurrentTimeX, NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { BeatBarModel } from "./beat-bar-model";
import { MVCView, WindowReflectableRegistry } from "@music-analyzer/view";

export class BeatBarView extends MVCView {
  protected readonly model: BeatBarModel;
  readonly svg: SVGLineElement;
  readonly y1: number;
  readonly y2: number;
  constructor(model: BeatBarModel) {
    super();
    this.model = model;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.svg.id = "bar";
    this.svg.style.stroke = "#000";
    this.svg.style.display = "none";  //NOTE: 一旦非表示にしている
    this.y1 = 0;
    this.y2 = PianoRollHeight.value;
    this.updateX();
    this.updateY();
    WindowReflectableRegistry.instance.register(this);
  }
  updateX() {
    this.svg.setAttribute("x1", String(CurrentTimeX.value + this.model.begin * NoteSize.value));
    this.svg.setAttribute("x2", String(this.model.begin * NoteSize.value));

  }
  updateY() {
    this.svg.setAttribute("y1", String(this.y1));
    this.svg.setAttribute("y2", String(this.y2));
  }
  onWindowResized() {
    this.updateX();
  }
}
