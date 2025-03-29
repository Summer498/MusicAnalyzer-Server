import { I_MVVM_Collection } from "./i-collection";
import { I_MVVM_ModelView } from "./i-mvvm";

export abstract class MVVM_Collection_Impl<
  VM extends I_MVVM_ModelView
> implements I_MVVM_Collection {
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
