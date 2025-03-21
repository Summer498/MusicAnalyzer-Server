import { BlackKeyPrm, octave_height, PianoRollBegin, WhiteKeyPrm } from "@music-analyzer/view-parameters";
import { mod } from "@music-analyzer/math";
import { WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";

const transposed = (e: number) => e - PianoRollBegin.get()
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export class WhiteKeySVG 
  implements WindowReflectable {
  readonly svg: SVGRectElement;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  constructor(
    readonly oct: number,
    white_index: number,
    publisher: WindowReflectableRegistry
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "white-key";
    this.svg.style.fill = WhiteKeyPrm.fill;
    this.svg.style.stroke = WhiteKeyPrm.stroke;
    this.y = octave_height * oct + mod(WhiteKeyPrm.height * [0, 1, 2, 3, 4, 5, 6][white_index] - convertToCoordinate(transposed(-1)), octave_height);
    this.width = WhiteKeyPrm.width;
    this.height = WhiteKeyPrm.height;
    publisher.register(this);
  }
  onWindowResized() {
    this.svg.setAttribute("x", String(0));
    this.svg.setAttribute("y", String(this.y));
    this.svg.setAttribute("width", String(this.width));
    this.svg.setAttribute("height", String(this.height));
  }
}
