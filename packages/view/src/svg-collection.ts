import { search_items_overlaps_range } from "@music-analyzer/time-and";
import { PianoRollTranslateX } from "@music-analyzer/view-parameters";
import { MVVM_Collection, MVVM_ViewModel, MVVM_Model, MVVM_View, I_MVVM_Collection, I_MVVM_View } from "./mvc";
import { AudioReflectable } from "./audio-reflectable";

export abstract class TimeAndMVCModel extends MVVM_Model {
  abstract readonly begin: number;
  abstract readonly end: number;
}

export interface I_TimeAndVM extends I_MVVM_View {
  model: TimeAndMVCModel;
}
export abstract class TimeAndVM<
  M extends TimeAndMVCModel,
  K extends keyof SVGElementTagNameMap
> extends MVVM_ViewModel<M, MVVM_View<M, K>> {
  abstract readonly model: M;
}

export interface I_ReflectableTimeAndMVCControllerCollection
  extends I_MVVM_Collection, AudioReflectable {
  readonly show: I_TimeAndVM[];
  readonly children: I_TimeAndVM[];
  readonly children_model: TimeAndMVCModel[]
}
export abstract class ReflectableTimeAndMVCControllerCollection<VM extends I_TimeAndVM>
  extends MVVM_Collection<VM>
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
    this.show.map(e => this.svg.appendChild(e.svg));
  }
  private updateShow(begin: number, end: number) {
    /*
    const remain = search_items_overlaps_range(this.show.map(e=>e.model), begin, end);
    this.show.splice(remain.end_index, this.show.length - remain.end_index).forEach(e=>e.view.svg.parentNode?.removeChild(e.view.svg));  // 右側にはみ出したものを消す
    this.show.splice(0, remain.begin_index).forEach(e=>e.view.svg.parentNode?.removeChild(e.view.svg));  // 左側にはみ出したものを消す
    */

    this.#show = []; //.splice(0, this.show.length);  // 全部消す
    this.svg.textContent = "";  // 全部消す

    const append = search_items_overlaps_range(this.children_model, begin - 5, end + 5);  // melodic gravity の矢印を隠すために ±5 のマージンを取る
    const fragment = document.createDocumentFragment();
    this.children.slice(append.begin_index, append.end_index).forEach(e => {
      this.show.push(e);
      fragment.appendChild(e.svg);
    });  // 必要分全部追加する
    this.svg.appendChild(fragment);
  }
  onAudioUpdate() {
    this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.value})`);
  }
}
