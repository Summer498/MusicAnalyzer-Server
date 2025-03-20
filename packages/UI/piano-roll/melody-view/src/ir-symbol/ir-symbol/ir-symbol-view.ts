import { size } from "@music-analyzer/view-parameters";
import { get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { MVVM_View } from "@music-analyzer/view";
import { IRSymbolModel } from "./ir-symbol-model";
import { ColorChangeSubscriber, hasArchetype, MelodyColorController } from "@music-analyzer/controllers";

const ir_analysis_em = size;

export class IRSymbolView 
  extends MVVM_View<IRSymbolModel, "text"> 
  implements
  ColorChangeSubscriber {
  #getColor: (e: hasArchetype) => string;
  constructor(
    model: IRSymbolModel,
    controllers: [MelodyColorController]
  ) {
    super(model, "text");
    this.svg.textContent = this.model.archetype.symbol;
    this.svg.id = "I-R Symbol";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${ir_analysis_em}em`;
    this.svg.style.textAnchor = "middle";
    this.#getColor = e => get_color_of_Narmour_concept(e.archetype);
    controllers[0].register(this)
  }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
  setColor(getColor: (e: hasArchetype) => string) {
    this.#getColor = getColor;
    this.svg.style.fill = this.#getColor(this.model) || "rgb(0, 0, 0)";
  }
  updateColor() {
    this.#getColor(this.model) || "rgb(0, 0, 0)";
  }
}
