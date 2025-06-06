import { BeatPos } from "@music-analyzer/musicxml";

export interface ReductionElement {
  readonly head: { readonly chord: { readonly note: { readonly id: BeatPos } } };
  readonly measure: number;
  readonly note: number;
  readonly primary_element: ReductionElement | undefined;
  readonly secondary_element: ReductionElement | undefined;
  forEach(callback: (value: ReductionElement) => void): void;
  getHeadElement(): ReductionElement;
  getDepthCount(): number;
  id2number(): number;
  getLeftEnd(): ReductionElement;
  getRightEnd(): ReductionElement;
  getArrayOfLayer(layer?: number): ReductionElement[];
}

const parseId = (id: BeatPos) => {
  const regexp = /P1-([0-9]+)-([0-9]+)/;
  const match = id.match(regexp);
  if (!match) {
    throw new SyntaxError(`Unexpected id received.\nExpected id is: ${regexp}`);
  }
  return { measure: Number(match[1]), note: Number(match[2]) };
};

function _getArrayOfLayer(element: ReductionElement, i: number, layer?: number): ReductionElement[] {
  if (layer !== undefined && i >= layer) { return [element]; }
  if (!element.primary_element && !element.secondary_element) { return [element]; }
  const p_array = element.primary_element && _getArrayOfLayer(element.primary_element, i + 1, layer);
  const s_array = element.secondary_element && _getArrayOfLayer(element.secondary_element, i + 1, layer);
  if (!p_array) { return s_array || []; }
  else if (!s_array) { return p_array; }
  else {
    const p_id = p_array[0].id2number();
    const s_id = s_array[0].id2number();
    return p_id < s_id ? [...p_array, ...s_array] : [...s_array, ...p_array];
  }
}

export const createReductionElement = (
  id: BeatPos,
  primary_element?: ReductionElement,
  secondary_element?: ReductionElement,
): Omit<ReductionElement, "head"> => {
  const { measure, note } = parseId(id);
  const element: any = {};
  element.measure = measure;
  element.note = note;
  element.primary_element = primary_element;
  element.secondary_element = secondary_element;
  element.forEach = (callback) => {
    callback(element);
    primary_element?.forEach(callback);
    secondary_element?.forEach(callback);
  };
  element.getHeadElement = () => primary_element ? primary_element.getHeadElement() : element;
  element.getDepthCount = () => 1 + Math.max(primary_element?.getDepthCount() || 0, secondary_element?.getDepthCount() || 0);
  element.id2number = () => measure * 1024 + note;
  element.getLeftEnd = () => {
    const primary = element.primary_element;
    const secondary = element.secondary_element;
    if (!primary) { return secondary ? secondary.getLeftEnd() : element; }
    else if (!secondary) { return primary.getLeftEnd(); }
    else {
      const p_id = primary.id2number();
      const s_id = secondary.id2number();
      return p_id < s_id ? primary.getLeftEnd() : secondary.getLeftEnd();
    }
  };
  element.getRightEnd = () => {
    const primary = element.primary_element;
    const secondary = element.secondary_element;
    if (!primary) { return secondary ? secondary.getRightEnd() : element; }
    else if (!secondary) { return primary.getRightEnd(); }
    else {
      const p_id = primary.id2number();
      const s_id = secondary.id2number();
      return s_id < p_id ? primary.getRightEnd() : secondary.getRightEnd();
    }
  };
  element.getArrayOfLayer = (layer?: number) => _getArrayOfLayer(element, 0, layer);
  return element as ReductionElement;
};
