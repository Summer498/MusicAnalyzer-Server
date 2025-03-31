import { BeatPos } from "./facade";

export abstract class ReductionElement {
  abstract readonly head: {
    readonly chord: { readonly note: { readonly id: BeatPos } },
  };
  readonly measure: number;
  readonly note: number;
  constructor(
    id: BeatPos,
    readonly primary_element: ReductionElement | undefined,
    readonly secondary_element: ReductionElement | undefined,
  ) {
    const regexp = /P1-([0-9]+)-([0-9]+)/;
    const match = id.match(regexp);
    if (match) {
      this.measure = Number(match[1]);
      this.note = Number(match[2]);
    }
    else {
      throw new SyntaxError(`Unexpected id received.\nExpected id is: ${regexp}`);
      this.measure = 0;
      this.note = 0;
    }
  }
  forEach(callback: (value: ReductionElement) => void) {
    callback(this);
    this.primary_element?.forEach(callback);
    this.secondary_element?.forEach(callback);
  }
  getHeadElement(): ReductionElement {
    return this.primary_element ? this.primary_element.getHeadElement() : this;
  }
  getDepthCount(): number {
    // returns depth count (1 based)
    // this.getArrayOfLayer(this.getDepth()-1) すると this と同じ階層の配列が取れる
    const p_depth = this.primary_element?.getDepthCount() || 0;
    const s_depth = this.secondary_element?.getDepthCount() || 0;
    return 1 + Math.max(p_depth, s_depth);
  }
  id2number() {
    return this.measure * 1024 + this.note;
  }
  getLeftEnd(): ReductionElement {
    const primary = this.primary_element;
    const secondary = this.secondary_element;
    if (!primary) { return secondary ? secondary.getLeftEnd() : this; }
    else if (!secondary) { return primary.getLeftEnd(); }
    else {
      const p_id = primary.id2number();
      const s_id = secondary.id2number();
      if (p_id < s_id) { return primary.getLeftEnd(); }
      else if (p_id >= s_id) { return secondary.getLeftEnd(); }
      else { throw new Error(`Reached unexpected code point`); }
    }
  }
  getRightEnd(): ReductionElement {
    const primary = this.primary_element;
    const secondary = this.secondary_element;
    if (!primary) { return secondary ? secondary.getRightEnd() : this; }
    else if (!secondary) { return primary.getRightEnd(); }
    else {
      const p_id = primary.id2number();
      const s_id = secondary.id2number();
      if (s_id < p_id) { return primary.getRightEnd(); }
      else if (s_id >= p_id) { return secondary.getRightEnd(); }
      else { throw new Error(`Reached unexpected code point`); }
    }
  }
  private _getArrayOfLayer(i: number, layer?: number): ReductionElement[] {
    if (layer !== undefined && i >= layer) { return [this]; }  // stop search
    if (this.primary_element === undefined && this.secondary_element === undefined) { return [this]; }  // arrival at leaf

    const p_array = this.primary_element?._getArrayOfLayer(i + 1, layer);
    const s_array = this.secondary_element?._getArrayOfLayer(i + 1, layer);

    // marge arrays
    if (!p_array) { return s_array || []; }
    else if (!s_array) { return p_array; }
    else {
      const p_id = p_array[0].id2number();
      const s_id = s_array[0].id2number();

      if (p_id < s_id) { return [...p_array, ...s_array]; }
      else if (p_id >= s_id) { return [...s_array, ...p_array]; }
      else { throw new Error(`Reached unexpected code point`); }
    }
  }
  getArrayOfLayer(layer?: number) {
    return this._getArrayOfLayer(0, layer);
  }
}
