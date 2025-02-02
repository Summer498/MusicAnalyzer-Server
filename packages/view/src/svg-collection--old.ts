import { search_items_overlaps_range } from "@music-analyzer/time-and";
import { AccompanyToAudioRegistry } from "./updatable-registry";
import { UpdatableTimeAndSVGs } from "./updatable-time-and-svgs";
import { AccompanyToAudio } from "./updatable";
import { CurrentTimeRatio, NowAt, PianoRollTimeLength } from "@music-analyzer/view-parameters";

export class SvgCollection__old implements AccompanyToAudio {
  readonly all: UpdatableTimeAndSVGs[];
  readonly show: UpdatableTimeAndSVGs[];
  readonly group: SVGGElement;
  constructor(name: string, all: UpdatableTimeAndSVGs[]) {
    this.all = all;
    this.show = [];
    this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.show.map(e => this.group.appendChild(e.svg));
    AccompanyToAudioRegistry.instance.register(this);
  }
  updateShow(begin: number, end: number) {
    // const remain = search_items_in_range(this.show, begin, end);
    // this.show.splice(0, remain.begin_index).forEach(e=>this.group.removeChild(e.svg));  // 左側にはみ出したものを消す
    // this.show.splice(remain.end_index, this.show.length - remain.end_index).forEach(e=>this.group.removeChild(e.svg));  // 右側にはみ出したものを消す
    this.show.splice(0, this.show.length);  // 全部消す
    this.group.childNodes.forEach(e => this.group.removeChild(e));  // 全部消す
    const append = search_items_overlaps_range(this.all, begin - 5, end + 5);  // melodic gravity の矢印を隠すために ±5 のマージンを取る
    this.all.slice(append.begin_index, append.end_index).forEach(e => { this.show.push(e); this.group.appendChild(e.svg); });  // 必要分全部追加する
  }
  onAudioUpdate() {
    this.updateShow(
      NowAt.value - PianoRollTimeLength.value * CurrentTimeRatio.value,
      NowAt.value + PianoRollTimeLength.value
    );
    this.show.forEach(e => e.onAudioUpdate());
  }
}
