import { search_items_overlaps_range } from "@music-analyzer/time-and";
import { Controller } from "./mvc";
import { Updatable } from "./updatable";
import { UpdatableRegistry } from "./updatable-registry";
import { CurrentTimeRatio, NowAt, PianoRollTimeLength } from "@music-analyzer/view-parameters";

export class SvgCollection implements Updatable {
  readonly all: Controller[];
  readonly show: Controller[];
  readonly group: SVGGElement;
  constructor(name: string, all: Controller[]) {
    this.all = all;
    this.show = [];
    this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.show.map(e => this.group.appendChild(e.view.svg));
    UpdatableRegistry.instance.register(this);
  }
  updateShow(begin: number, end: number) {
    // const remain = search_items_in_range(this.show, begin, end);
    // this.show.splice(0, remain.begin_index).forEach(e=>this.group.removeChild(e.svg));  // 左側にはみ出したものを消す
    // this.show.splice(remain.end_index, this.show.length - remain.end_index).forEach(e=>this.group.removeChild(e.svg));  // 右側にはみ出したものを消す
    this.show.splice(0, this.show.length);  // 全部消す
    this.group.childNodes.forEach(e => this.group.removeChild(e));  // 全部消す
    const append = search_items_overlaps_range(this.all.map(e => e.model), begin - 5, end + 5);  // melodic gravity の矢印を隠すために ±5 のマージンを取る
    this.all.slice(append.begin_index, append.end_index).forEach(e => { this.show.push(e); this.group.appendChild(e.view.svg); });  // 必要分全部追加する
  }
  onUpdate() {
    this.updateShow(
      NowAt.value - PianoRollTimeLength.value * CurrentTimeRatio.value,
      NowAt.value + PianoRollTimeLength.value
    );
    this.show.forEach(e => e.onUpdate());
  }
}
