import { ColorSelector } from "./color-selector";
import { GetColor } from "./irm-color/get-color";

export class IRM_ColorSelector
  extends ColorSelector<GetColor> {
  getColor: GetColor;
  constructor(
    id: string,
    text: string,
    getColor: GetColor,
  ) {
    super(id, text);
    this.getColor = getColor
  }
  update() {
    this.listeners.forEach(setColor => setColor(triad => this.getColor(triad)));
  }
}
