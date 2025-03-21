export abstract class MVVM_Model { }

export interface I_MVVM_View {
  readonly svg: SVGElement
}
export abstract class MVVM_View<
  M extends MVVM_Model,
  K extends keyof SVGElementTagNameMap,
> {
  readonly svg: SVGElementTagNameMap[K];
  constructor(
    svg_tagname: K,
    protected readonly model: M,
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", svg_tagname);
  }
}

export interface I_MVVM_ModelView
  extends I_MVVM_View { }
export abstract class MVVM_ViewModel<
  M extends MVVM_Model,
  V extends I_MVVM_View,
>
  implements I_MVVM_ModelView {
  get svg() { return this.view.svg; }
  constructor(
    readonly model: M,
    protected readonly view: V,
  ) { }
}

export interface I_MVVM_Collection
  extends I_MVVM_View {
  readonly svg: SVGGElement
  readonly children: I_MVVM_ModelView[];
}

export abstract class MVVM_Collection<VM extends I_MVVM_ModelView>
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
}
