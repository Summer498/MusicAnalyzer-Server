import { TimeAnd } from "@music-analyzer/time-and";
import { AccompanyToAudio } from "./updatable";

export abstract class MVCModel implements TimeAnd {
  readonly abstract begin: number;
  readonly abstract end: number;
}

export abstract class MVCView {
  readonly abstract svg: SVGElement
  protected readonly abstract model: MVCModel;
}

export abstract class MVCController implements AccompanyToAudio {
  readonly abstract model: MVCModel;
  readonly abstract view: MVCView
  abstract onAudioUpdate(): void;
}
