import { WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";
import { BlackKeyPrm, BlackPosition, octave_height } from "@music-analyzer/view-parameters";

export class BlackKeySVG 
  implements WindowReflectable {
  readonly svg: SVGRectElement;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  constructor(
    readonly oct: number,
    black_index: number,
    publisher: WindowReflectableRegistry
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "black-key";
    this.svg.style.fill = BlackKeyPrm.fill;
    this.svg.style.stroke = BlackKeyPrm.stroke;
    
    this.y = octave_height * oct + BlackKeyPrm.height * BlackPosition.get()[black_index];
    this.width = BlackKeyPrm.width;
    this.height = BlackKeyPrm.height;
    publisher.register(this);
  }
  onWindowResized() {
    this.svg.setAttribute("x", String(0));
    this.svg.setAttribute("y", String(this.y));
    this.svg.setAttribute("width", String(this.width));
    this.svg.setAttribute("height", String(this.height));
  }
}
