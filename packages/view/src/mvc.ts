import { WindowReflectable } from "./window-reflectable";

export abstract class MVVM_Model { }

export abstract class MVVM_View implements WindowReflectable {
  readonly abstract svg: SVGElement
  protected readonly abstract model: MVVM_Model;
  abstract onWindowResized(): void;
}

export abstract class MVVM_ViewModel implements WindowReflectable {
  readonly abstract model: MVVM_Model;
  readonly abstract view: MVVM_View
  onWindowResized() {
    this.view.onWindowResized();
  }
}

export abstract class MVVM_Collection implements WindowReflectable {
  readonly svg: SVGGElement;
  constructor(
    readonly children: MVVM_ViewModel[],
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.children.map(e => this.svg.appendChild(e.view.svg));
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}
