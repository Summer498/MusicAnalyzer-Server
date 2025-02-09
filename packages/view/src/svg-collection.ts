import { search_items_overlaps_range, TimeAnd } from "@music-analyzer/time-and";
import { MVCController, MVCModel } from "./mvc";
import { AccompanyToAudio } from "./updatable";
import { CurrentTimeRatio, NowAt, PianoRollTimeLength } from "@music-analyzer/view-parameters";

export abstract class TimeAndMVCModel extends MVCModel implements TimeAnd {
  abstract readonly begin: number;
  abstract readonly end: number;
}

export abstract class TimeAndMVCController extends MVCController {
  abstract readonly model: TimeAndMVCModel;
}

export abstract class SvgCollection implements AccompanyToAudio {
  readonly children: TimeAndMVCController[];
  readonly children_model: TimeAndMVCModel[];
  #show: TimeAndMVCController[];
  get show() { return this.#show; };
  readonly svg: SVGGElement;
  constructor(children: TimeAndMVCController[]) {
    this.children = children;
    this.children_model = this.children.map(e => e.model);
    this.#show = [];
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.show.map(e => this.svg.appendChild(e.view.svg));
  }
  updateShow(begin: number, end: number) {
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
      fragment.appendChild(e.view.svg);
    });  // 必要分全部追加する
    this.svg.appendChild(fragment);
  }
  onAudioUpdate() {
    this.updateShow(
      NowAt.value - PianoRollTimeLength.value * CurrentTimeRatio.value,
      NowAt.value + PianoRollTimeLength.value
    );
    this.show.forEach(e => e.onAudioUpdate());
  }
}
