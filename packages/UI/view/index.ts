import { Time } from "@music-analyzer/time-and";
import { search_items_overlaps_range } from "@music-analyzer/time-and";
import { CurrentTimeX } from "@music-analyzer/view-parameters";
import { NoteSize } from "@music-analyzer/view-parameters";
import { NowAt } from "@music-analyzer/view-parameters";

export interface I_MVVM_View {
  readonly svg: SVGElement
}

export abstract class A_MVVM_View
  implements I_MVVM_View {
  abstract readonly svg: SVGElement
}

export abstract class MVVM_Collection_Impl<
  VM extends I_MVVM_View
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

interface I_MVVM_Collection
  extends I_MVVM_View {
  readonly svg: SVGGElement
  readonly children: I_MVVM_View[];
}

export abstract class MVVM_ViewModel_Impl<
  M extends {},
  V extends I_MVVM_View,
> implements I_MVVM_View {
  get svg() { return this.view.svg; }
  constructor(
    readonly model: M,
    protected readonly view: V,
  ) { }
}


export abstract class MVVM_View_Impl<
  K extends keyof SVGElementTagNameMap
> implements I_MVVM_View {
  readonly svg: SVGElementTagNameMap[K];
  constructor(
    svg_tagname: K
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", svg_tagname);
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

export interface I_TimeAndVM
  extends I_MVVM_View {
  model: TimeAndMVCModel;
}
class PianoRollTranslateX {
  static get() {
    return CurrentTimeX.get() - NowAt.get() * NoteSize.get();
  }
}

export abstract class ReflectableTimeAndMVCControllerCollection<VM extends I_TimeAndVM>
  extends MVVM_Collection_Impl<VM>
  implements I_ReflectableTimeAndMVCControllerCollection {
  readonly children_model: TimeAndMVCModel[];
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
  private updateShow(begin: number, end: number) {
    /*
    const remain = search_items_overlaps_range(this.show.map(e=>e.model), begin, end);
    this.show.splice(remain.end_index, this.show.length - remain.end_index).forEach(e=>e.view.svg.parentNode?.removeChild(e.view.svg));  // 右側にはみ出したものを消す
    this.show.splice(0, remain.begin_index).forEach(e=>e.view.svg.parentNode?.removeChild(e.view.svg));  // 左側にはみ出したものを消す
    */

    this.#show = []; //.splice(0, this.show.length);  // 全部消す
    this.svg.textContent = "";  // 全部消す

    const append = search_items_overlaps_range(this.children_model, new Time(begin - 5, end + 5));  // melodic gravity の矢印を隠すために ±5 のマージンを取る
    const fragment = document.createDocumentFragment();
    this.children.slice(append.begin_index, append.end_index).forEach(e => {
      this.show.push(e);
      fragment.appendChild(e.svg);
    });  // 必要分全部追加する
    this.svg.appendChild(fragment);
  }
  onAudioUpdate() {
    this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
  }
}

abstract class TimeAndMVCModel {
  abstract readonly time: Time;
}

export abstract class TimeAndVM<
  M extends TimeAndMVCModel,
  K extends keyof SVGElementTagNameMap
>
  extends MVVM_ViewModel_Impl<M, MVVM_View_Impl<K>> {
  abstract readonly model: M;
}

export class CollectionLayer<VM extends I_TimeAndVM>
  extends ReflectableTimeAndMVCControllerCollection<VM>
  implements I_CollectionLayer {
  constructor(
    readonly layer: number,
    children: VM[],
  ) {
    super(`layer-${layer}`, children);
  }
}

interface ICollectionHierarchy
  extends I_MVVM_Collection {
  readonly children: I_MVVM_View[];
}

export interface I_CollectionLayer
  extends I_ReflectableTimeAndMVCControllerCollection {
  readonly layer: number
  onAudioUpdate(): void
}

interface I_ReflectableTimeAndMVCControllerCollection
  extends I_MVVM_Collection {
  readonly show: I_TimeAndVM[];
  readonly children: I_TimeAndVM[];
  readonly children_model: TimeAndMVCModel[]
}

export abstract class CollectionHierarchy<L extends I_CollectionLayer>
  extends MVVM_Collection_Impl<L>
  implements ICollectionHierarchy {
  protected _show: L[];
  get show() { return this._show; }
  constructor(id: string, readonly children: L[]) {
    super(id, children);
    this._show = [];
  }
  protected setShow(visible_layers: L[]) {
    this._show = visible_layers;
    this._show.forEach(e => e.onAudioUpdate());
    this.svg.replaceChildren(...this._show.map(e => e.svg));
  }
  onChangedLayer(value: number) {
    const visible_layer = this.children.filter(e => value === e.layer);
    this.setShow(visible_layer);
  }
}
