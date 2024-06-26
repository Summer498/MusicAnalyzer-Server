import { TimeAnd, search_items_overlaps_range } from "@music-analyzer/time-and";
import { SVG } from "@music-analyzer/html";
import { 
  piano_roll_time_length, 
  current_time_ratio, 
  PianoRollWidth, 
  CurrentTimeX, 
  NoteSize, 
} from "@music-analyzer/view-parameters";


export interface TimeAndSVGs<T extends SVGElement> extends TimeAnd { svg: T; }

export interface Updatable {
  onUpdate: (now_at: number) => void
}

// WARNING: リファクタリング途中の汚いインターフェイス
export interface UpdatableAndShowable {
  updateShow: (begin: number, end: number) => void,
  onUpdate: (now_at: number) => void
}

export interface WindowReflectable {
  onWindowResized: () => void
}

export class UpdatableRegistry {
  private static _instance: UpdatableRegistry;
  private readonly registered: UpdatableAndShowable[];
  private constructor() { this.registered = []; }
  public static get instance() {
    return this._instance || (this._instance = new UpdatableRegistry());
  }
  register(updatable: UpdatableAndShowable) { this.registered.push(updatable); }
  onUpdate(now_at: number) {
    this.registered.forEach(e => {
      e.updateShow(
        now_at - piano_roll_time_length * current_time_ratio,
        now_at + piano_roll_time_length
      );
      e.onUpdate(now_at);
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

export class SvgCollection<T extends SVGElement, Updatable extends TimeAndSVGs<T>> implements UpdatableAndShowable {
  readonly all: Updatable[];
  readonly show: Updatable[];
  readonly group: SVGGElement;
  readonly onUpdate: (now_at: number) => void;
  constructor(name: string, all: Updatable[], onUpdate: (e: Updatable, now_at: number) => void) {
    this.all = all;
    this.show = [];
    this.group = SVG.g({ name }, undefined, this.show.map(e => e.svg));
    this.onUpdate = (now_at) => this.show.forEach(e => onUpdate(e, now_at));
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
}

export class SvgAndParam {
  svg;
  oct;
  y;
  width;
  height;
  constructor(svg: SVGElement, oct: number, y: number, width: number, height: number) {
    this.svg = svg;
    this.oct = oct;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}