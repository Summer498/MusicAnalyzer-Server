import { thirdToColor } from "@music-analyzer/color/src/third-to-color";
import { ChordPartView } from "./chord-part-view";
import { ChordNoteModel } from "./chord-note-model";


export class ChordNoteView 
  extends ChordPartView<"rect"> {
  constructor(model: ChordNoteModel) {
    super("rect", model);
    this.svg.style.stroke = "rgb(64, 64, 64)";
    this.svg.style.fill = thirdToColor(
      model.note_name,
      this.model.tonic,
      0.25,
      1
    );
    if (false) {
      this.svg.style.fill = this.getColor(0.25, model.type === "major" ? 1 : 0.9);
    }
  }
  updateWidth(w:number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h:number) { this.svg.setAttribute("height", String(h)); }
}
