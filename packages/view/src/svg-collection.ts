import { search_items_overlaps_range } from "@music-analyzer/time-and";
import { MVCController } from "./mvc";
import { AccompanyToAudio } from "./updatable";
import { AccompanyToAudioRegistry } from "./updatable-registry";
import { CurrentTimeRatio, NowAt, PianoRollTimeLength } from "@music-analyzer/view-parameters";

export abstract class SvgCollection implements AccompanyToAudio {
  readonly children: MVCController[];
  readonly show: MVCController[];
  readonly svg: SVGGElement;
  constructor(children: MVCController[]) {
    this.children = children;
    this.show = [];
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.show.map(e => this.svg.appendChild(e.view.svg));
    AccompanyToAudioRegistry.instance.register(this);
    console.log("AccompanyToAudioRegistry.instance");
    console.log(AccompanyToAudioRegistry.instance);
  }
  updateShow(begin: number, end: number) {
    // const remain = search_items_in_range(this.show, begin, end);
    // this.show.splice(0, remain.begin_index).forEach(e=>this.svg.removeChild(e.svg));  // 左側にはみ出したものを消す
    // this.show.splice(remain.end_index, this.show.length - remain.end_index).forEach(e=>this.group.removeChild(e.svg));  // 右側にはみ出したものを消す
    this.show.splice(0, this.show.length);  // 全部消す
    this.svg.childNodes.forEach(e => this.svg.removeChild(e));  // 全部消す
    const append = search_items_overlaps_range(this.children.map(e => e.model), begin - 5, end + 5);  // melodic gravity の矢印を隠すために ±5 のマージンを取る
    this.children.slice(append.begin_index, append.end_index).forEach(e => {
      this.show.push(e);
      this.svg.appendChild(e.view.svg);
    });  // 必要分全部追加する
  }
  onAudioUpdate() {
    this.updateShow(
      NowAt.value - PianoRollTimeLength.value * CurrentTimeRatio.value,
      NowAt.value + PianoRollTimeLength.value
    );
    this.show.forEach(e => e.onAudioUpdate());
  }
}
