import { Triad } from "@music-analyzer/irm";
import { ColorSelector } from "./color-selector";
import { GetColor } from "./irm-color";

export class IRM_ColorSelector
  extends ColorSelector<GetColor> {
  getColor: (e: Triad) => string;
  constructor(
    id: string,
    text: string,
    getColor: (e: Triad) => string,
  ) {
    super(id, text);
    this.getColor = getColor
  }
  update() {
    this.listeners.forEach(setColor => setColor(triad => this.getColor(triad)));
  }
}
