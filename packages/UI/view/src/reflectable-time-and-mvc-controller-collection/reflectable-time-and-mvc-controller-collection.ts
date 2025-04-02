import { search_items_overlaps_range } from "@music-analyzer/time-and";
import { Time } from "@music-analyzer/time-and";
import { MVVM_Collection_Impl } from "../mvvm/collection-impl";
import { TimeAndMVCModel } from "./time-and-model";
import { I_ReflectableTimeAndMVCControllerCollection } from "./i-reflectable-time-and-mvc-controller-collection";
import { I_TimeAndVM } from "./i-time-and-model";
import { CurrentTimeX } from "@music-analyzer/view-parameters";
import { NoteSize } from "@music-analyzer/view-parameters";
import { NowAt } from "@music-analyzer/view-parameters";

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
