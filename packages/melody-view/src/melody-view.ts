export class MelodyView {
  readonly svg: SVGRectElement;
  sound_reserved: boolean;
  constructor(color: string) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "melody-note";
    this.svg.style.fill = color;
    this.svg.style.stroke = "#444";
    this.sound_reserved = false;
  }
  set x(value: number) { this.svg.style.x = String(value); }
  set y(value: number) { this.svg.style.y = String(value); }
  set width(value: number) { this.svg.style.width = String(value); }
  set height(value: number) { this.svg.style.height = String(value); }
  get visibility() {
    const visibility = this.svg.getAttribute("visibility");
    if (visibility === "visible" || visibility === "hidden") { return visibility; }
    else { throw new TypeError(`Illegal string received. Expected is "visible" or "hidden" but reserved is ${visibility}`); }
  }
  set visibility(value: "visible" | "hidden") { this.svg.style.visibility = value; }
  set onclick(value: () => void) { this.svg.onclick = value; }
}
