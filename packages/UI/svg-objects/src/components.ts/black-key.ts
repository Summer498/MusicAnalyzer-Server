import { WindowReflectable } from "@music-analyzer/view";
import { BlackKeyPrm, BlackPosition, octave_height } from "@music-analyzer/view-parameters";

export class BlackKeySVG 
  implements WindowReflectable {
  readonly svg: SVGRectElement;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  constructor(
    readonly oct: number,
    j: number
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "black-key";
    this.svg.style.fill = BlackKeyPrm.fill;
    this.svg.style.stroke = BlackKeyPrm.stroke;
    
    this.y = octave_height * oct + BlackKeyPrm.height * BlackPosition.get()[j];
    this.width = BlackKeyPrm.width;
    this.height = BlackKeyPrm.height;
  }
  onWindowResized() {
    this.svg.setAttribute("x", String(0));
    this.svg.setAttribute("y", String(this.y));
    this.svg.setAttribute("width", String(this.width));
    this.svg.setAttribute("height", String(this.height));
  }
}
