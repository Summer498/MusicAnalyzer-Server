import { WindowReflectable } from "./window-reflectable";

export abstract class MVVM_Model { }

export interface I_MVVM_View extends WindowReflectable {
  readonly svg: SVGElement
}
export abstract class MVVM_View<
  M extends MVVM_Model,
  K extends keyof SVGElementTagNameMap,
> implements I_MVVM_View {
  readonly svg: SVGElementTagNameMap[K];
  constructor(
    protected readonly model: M,
    svg_tagname: K
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", svg_tagname);
  }
  abstract onWindowResized(): void;
}

export interface I_MVVM_ViewModel extends WindowReflectable {
  readonly model: MVVM_Model,
  readonly view: I_MVVM_View,
}
export abstract class MVVM_ViewModel<
  M extends MVVM_Model,
  V extends I_MVVM_View,
> implements I_MVVM_ViewModel {
  constructor(
    readonly model: M,
    readonly view: V,
  ) { }
  onWindowResized() {
    this.view.onWindowResized();
  }
}

interface I_MVVM_Collection
  extends WindowReflectable {
  readonly svg: SVGGElement
  readonly children: I_MVVM_ViewModel[];
}

export abstract class MVVM_Collection<VM extends I_MVVM_ViewModel>
  implements I_MVVM_Collection {
  readonly svg: SVGGElement;
  constructor(
    readonly children: VM[],
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.children.map(e => this.svg.appendChild(e.view.svg));
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}
