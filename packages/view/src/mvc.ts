import { WindowReflectable } from "./window-reflectable";

export abstract class MVCModel { }

export abstract class MVCView implements WindowReflectable {
  readonly abstract svg: SVGElement
  protected readonly abstract model: MVCModel;
  abstract onWindowResized(): void;
}

export abstract class MVCController implements WindowReflectable{
  readonly abstract model: MVCModel;
  readonly abstract view: MVCView
  onWindowResized(){
    this.view.onWindowResized();
  }
}
