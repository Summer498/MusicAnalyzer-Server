import { fifthToColor } from "@music-analyzer/color/src/fifth-to-color";;
import { thirdToColor } from "@music-analyzer/color/src/third-to-color";
import { MVVM_View } from "@music-analyzer/view/src/mvc";
import { ChordNoteModel } from "./chord-note-model";


export class ChordNoteView 
  extends MVVM_View<"rect", ChordNoteModel> {
  constructor(model: ChordNoteModel) {
    super("rect", model);
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
