import { WindowReflectable } from "./window-reflectable";

export abstract class MVVM_Model { }

export interface I_MVVM_View extends WindowReflectable {
  readonly svg: SVGElement
}
export abstract class MVVM_View<M extends MVVM_Model, K extends keyof SVGElementTagNameMap> implements I_MVVM_View {
  readonly svg: SVGElementTagNameMap[K];
  constructor(
    protected readonly model: M,
    svg_tagname: K
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", svg_tagname);
  }
  abstract onWindowResized(): void;
}

export abstract class MVVM_ViewModel implements WindowReflectable {
  readonly abstract model: MVVM_Model;
  readonly abstract view: I_MVVM_View;
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
