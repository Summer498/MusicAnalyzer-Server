import { WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";

export abstract class SvgAndParam implements WindowReflectable {
  readonly abstract svg: SVGElement;
  abstract onWindowResized(): void
}

export abstract class SvgAndParams<T extends SvgAndParam> implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly abstract children: T[];
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}

export class SvgAndParamsReflectable<T extends SvgAndParam> implements WindowReflectable {
  readonly svg: T[];
  constructor(svg_and_params: T[]) {
    this.svg = svg_and_params;
    WindowReflectableRegistry.instance.register(this);
  }
  onWindowResized() {
    this.svg.forEach(e => e.onWindowResized());
  }
}

