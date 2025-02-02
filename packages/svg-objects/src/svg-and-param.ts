import { WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";

export abstract class SvgAndParam implements WindowReflectable {
  readonly abstract svg: SVGElement;
  abstract onWindowResized(): void
}

export class SvgAndParams<T extends SvgAndParam> implements WindowReflectable {
  readonly svg: T[];
  constructor(svg_and_params: T[]) {
    this.svg = svg_and_params;
    WindowReflectableRegistry.instance.register(this);
  }
  onWindowResized() {
    this.svg.forEach(e => e.onWindowResized());
  }
}

