import { fifthToColor, thirdToColor } from "@music-analyzer/color";
import { MVVM_View } from "@music-analyzer/view";
import { ChordNoteModel } from "./chord-note-model";


export class ChordNoteView 
  extends MVVM_View<ChordNoteModel, "rect"> {
  constructor(model: ChordNoteModel) {
    super(model, "rect");
    this.svg.style.stroke = "rgb(64, 64, 64)";
    this.svg.style.fill = thirdToColor(
      this.model.note_name,
      this.model.tonic,
      0.25,
      1
    );
    if (false) {
      this.svg.style.fill = fifthToColor(this.model.tonic, 0.25, this.model.type === "major" ? 1 : 0.9);
    }
  }
  updateX(x:number) { this.svg.setAttribute("x", String(x)); }
  updateY(y:number) { this.svg.setAttribute("y", String(y)); }
  updateWidth(w:number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h:number) { this.svg.setAttribute("height", String(h)); }
}
