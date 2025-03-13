import { WindowReflectable } from "@music-analyzer/music-analyzer-application";

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
    svg_tagname: K,
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", svg_tagname);
  }
  abstract onWindowResized(): void;
}

export abstract class MVVM_ViewModel<
  M extends MVVM_Model,
  V extends I_MVVM_View,
> implements I_MVVM_View {
  get svg() { return this.view.svg; }
  constructor(
    readonly model: M,
    protected readonly view: V,
  ) { }
  onWindowResized() {
    this.view.onWindowResized();
  }
}

export interface I_MVVM_Collection
  extends I_MVVM_View {
  readonly svg: SVGGElement
  readonly children: I_MVVM_View[];
}

export abstract class MVVM_Collection<VM extends I_MVVM_View>
  implements I_MVVM_Collection {
  readonly svg: SVGGElement;
  constructor(
    id: string,
    readonly children: VM[],
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = id;
    this.children.forEach(e => this.svg.appendChild(e.svg));
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}
