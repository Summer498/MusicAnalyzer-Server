import { Triad } from "@music-analyzer/irm";
import { ColorSelector } from "./color-selector";
import { ColorChangeSubscriber } from "./melody-color-selector";

export class IRM_ColorSelector extends ColorSelector<ColorChangeSubscriber> {
  getColor: (e:Triad)=>string;
  constructor(
    id:string,
    text:string,
    getColor: (e:Triad)=>string,
  ) {
    super(id,text);
    this.getColor = getColor
  }
  update() {
    this.subscribers.forEach(e => e.setColor(e => this.getColor(e.archetype)));
  }
}
