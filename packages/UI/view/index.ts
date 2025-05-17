import { Time } from "@music-analyzer/time-and";
import { CurrentTimeX } from "@music-analyzer/view-parameters";
import { NoteSize } from "@music-analyzer/view-parameters";
import { NowAt } from "@music-analyzer/view-parameters";

export abstract class MVVM_Collection_Impl<
  VM extends { readonly svg: SVGElement }
> {
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

export class AudioReflectableRegistry {
  static #count = 0;
  constructor() {
    if (AudioReflectableRegistry.#count >= 1) { throw new Error("this constructor should not be called twice (singleton)"); }
    AudioReflectableRegistry.#count++;
  }
  private readonly listeners: (() => void)[] = []
  addListeners(...listeners: (() => void)[]) { this.listeners.push(...listeners); }
  onUpdate() { this.listeners.forEach(e => e()); }
}

export class WindowReflectableRegistry {
  static #count = 0;
  constructor() {
    if (WindowReflectableRegistry.#count >= 1) { throw new Error("this constructor should not be called twice (singleton)"); }
    WindowReflectableRegistry.#count++;
  }
  private readonly listeners: (() => void)[] = [];
  addListeners(...listeners: (() => void)[]) { this.listeners.push(...listeners); }
  onUpdate() { this.listeners.forEach(e => e()); }
}

class PianoRollTranslateX {
  static get() {
    return CurrentTimeX.get() - NowAt.get() * NoteSize.get();
  }
}

export abstract class ReflectableTimeAndMVCControllerCollection<VM extends {
  readonly svg: SVGElement
  readonly model: { readonly time: Time };
}>
  extends MVVM_Collection_Impl<VM> {
  readonly children_model: { readonly time: Time }[];
  #show: VM[];
  get show() { return this.#show; };
  constructor(
    id: string,
    readonly children: VM[],
  ) {
    super(id, children);
    this.children_model = this.children.map(e => e.model);
    this.#show = children;
  }
  onAudioUpdate() {
    this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
  }
}

export class CollectionLayer<VM extends {
  readonly svg: SVGElement
  readonly model: { readonly time: Time };
}>
  extends ReflectableTimeAndMVCControllerCollection<VM> {
  constructor(
    readonly layer: number,
    children: VM[],
  ) {
    super(`layer-${layer}`, children);
  }
}

type Part = {
  readonly svg: SVGElement
  readonly model: { readonly time: Time };
}

export abstract class CollectionHierarchy<L extends {
  readonly svg: SVGGElement
  readonly show: Part[];
  readonly children: Part[];
  readonly children_model: { readonly time: Time }[]
  readonly layer: number
  onAudioUpdate(): void
}>
  extends MVVM_Collection_Impl<L> {
  protected _show: L[];
  get show() { return this._show; }
  constructor(id: string, readonly children: L[]) {
    super(id, children);
    this._show = [];
  }
  setShow(visible_layers: L[]) {
    this._show = visible_layers;
    this._show.forEach(e => e.onAudioUpdate());
    this.svg.replaceChildren(...this._show.map(e => e.svg));
  }
  onChangedLayer(value: number) {
    const visible_layer = this.children.filter(e => value === e.layer);
    this.setShow(visible_layer);
  }
}
