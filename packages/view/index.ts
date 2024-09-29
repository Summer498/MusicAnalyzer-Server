import { search_items_overlaps_range, TimeAnd } from "@music-analyzer/time-and";
import { SVG } from "@music-analyzer/html";
import { PianoRollTimeLength, current_time_ratio, PianoRollWidth, CurrentTimeX, NoteSize, NowAt } from "@music-analyzer/view-parameters";
import { _throw } from "@music-analyzer/stdlib";

export interface Updatable {
  onUpdate(): void
}

interface UpdatableTimeAndSVGs extends Updatable, TimeAnd {
  svg: SVGElement;
}
interface Model extends TimeAnd { }
interface View {
  svg: SVGElement
}
interface Controller extends Updatable {
  model: Model;
  view: View
}

export interface WindowReflectable {
  onWindowResized(): void
}

export class UpdatableRegistry {
  private static _instance: UpdatableRegistry;
  private readonly registered: Updatable[];
  private constructor() { this.registered = []; }
  public static get instance() {
    return this._instance || (this._instance = new UpdatableRegistry());
  }
  register(updatable: Updatable) { this.registered.push(updatable); }
  onUpdate() {
    this.registered.forEach(e => {
      e.onUpdate();
    });
  }
}

export class WindowReflectableRegistry {
  private static _instance: WindowReflectableRegistry;
  private readonly registered: WindowReflectable[];
  private constructor() { this.registered = []; }
  public static get instance() {
    return this._instance || (this._instance = new WindowReflectableRegistry());
  }
  register(updatable: WindowReflectable) { this.registered.push(updatable); }
  onWindowResized() {
    PianoRollWidth.onWindowResized();
    CurrentTimeX.onWindowResized();
    NoteSize.onWindowResized();

    this.registered.forEach(e => e.onWindowResized());
  }
}

export class SvgCollection implements Updatable {
  readonly all: UpdatableTimeAndSVGs[];
  readonly show: UpdatableTimeAndSVGs[];
  readonly group: SVGGElement;
  constructor(name: string, all: UpdatableTimeAndSVGs[]) {
    this.all = all;
    this.show = [];
    this.group = SVG.g();
    this.group.setAttribute("name", name);
    this.group.appendChildren(this.show.map(e => e.svg));
    UpdatableRegistry.instance.register(this);
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
  onUpdate() {
    this.updateShow(
      NowAt.value - PianoRollTimeLength.value * current_time_ratio,
      NowAt.value + PianoRollTimeLength.value
    );
    this.show.forEach(e => e.onUpdate());
  }
}

export class SvgCollection2 implements Updatable {
  readonly all: Controller[];
  readonly show: Controller[];
  readonly group: SVGGElement;
  constructor(name: string, all: Controller[]) {
    this.all = all;
    this.show = [];
    this.group = SVG.g();
    this.group.setAttribute("name", name);
    this.group.appendChildren(this.show.map(e => e.view.svg));
    UpdatableRegistry.instance.register(this);
  }
  updateShow(begin: number, end: number) {
    // const remain = search_items_in_range(this.show, begin, end);
    // this.show.splice(0, remain.begin_index).forEach(e=>this.group.removeChild(e.svg));  // 左側にはみ出したものを消す
    // this.show.splice(remain.end_index, this.show.length - remain.end_index).forEach(e=>this.group.removeChild(e.svg));  // 右側にはみ出したものを消す
    this.show.splice(0, this.show.length);  // 全部消す
    this.group.childNodes.forEach(e => this.group.removeChild(e));  // 全部消す
    const append = search_items_overlaps_range(this.all.map(e=>e.model), begin - 5, end + 5);  // melodic gravity の矢印を隠すために ±5 のマージンを取る
    this.all.slice(append.begin_index, append.end_index).forEach(e => { this.show.push(e); this.group.appendChild(e.view.svg); });  // 必要分全部追加する
  }
  onUpdate() {
    this.updateShow(
      NowAt.value - PianoRollTimeLength.value * current_time_ratio,
      NowAt.value + PianoRollTimeLength.value
    );
    this.show.forEach(e => e.onUpdate());
  }
}
