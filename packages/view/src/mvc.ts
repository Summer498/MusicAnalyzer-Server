import { WindowReflectable } from "./window-reflectable";

export abstract class MVCModel { }

export abstract class MVCView implements WindowReflectable {
  readonly abstract svg: SVGElement
  protected readonly abstract model: MVCModel;
  abstract onWindowResized(): void;
}

export abstract class MVCController implements WindowReflectable {
  readonly abstract model: MVCModel;
  readonly abstract view: MVCView
  onWindowResized() {
    this.view.onWindowResized();
  }
}

export abstract class MVCCollection implements WindowReflectable {
  readonly svg: SVGGElement;
  constructor(
    readonly children: MVCController[],
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.children.map(e => this.svg.appendChild(e.view.svg));
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}
