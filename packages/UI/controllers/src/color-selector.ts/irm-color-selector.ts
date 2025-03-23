import { Triad } from "@music-analyzer/irm";
import { ColorSelector } from "./color-selector";

export type GetColor = (e: Triad) => string;
export type SetColor = (getColor: GetColor) => void;

export interface ColorChangeSubscriber {
  setColor: SetColor
}

export class IRM_ColorSelector 
  extends ColorSelector<ColorChangeSubscriber> {
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
    this.subscribers.forEach(e => e.setColor(triad => this.getColor(triad)));
  }
}
