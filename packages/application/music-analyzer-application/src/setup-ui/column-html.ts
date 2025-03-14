export class ColumnHTML {
  readonly div: HTMLDivElement
  constructor(...children: (HTMLElement | SVGSVGElement)[]) {
    this.div = document.createElement("div");
    this.div.setAttribute("style", `column-count: ${children.length}`);
    children.forEach(e => this.div.appendChild(e));
  }
}