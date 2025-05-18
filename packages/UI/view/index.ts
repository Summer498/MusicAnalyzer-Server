import { Time } from "@music-analyzer/time-and";
import { CurrentTimeX } from "@music-analyzer/view-parameters";
import { NoteSize } from "@music-analyzer/view-parameters";
import { NowAt } from "@music-analyzer/view-parameters";

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

export class PianoRollTranslateX {
  static get() {
    return CurrentTimeX.get() - NowAt.get() * NoteSize.get();
  }
}

type Part = {
  readonly svg: SVGElement
  readonly model: { readonly time: Time };
}

type Layer = {
  readonly svg: SVGGElement
  readonly show: Part[];
  readonly children: Part[];
  readonly children_model: { readonly time: Time }[]
  readonly layer: number
  onAudioUpdate(): void
}

export abstract class CollectionHierarchy<L extends Layer> {
  readonly svg: SVGGElement
  readonly children: L[]
  protected _show: L[];
  get show() { return this._show; }
  constructor(id: string, children: L[]) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach(e => svg.appendChild(e.svg));
    this._show = [];
    this.svg = svg
    this.children = children
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
