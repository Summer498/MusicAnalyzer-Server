import { PianoRollBegin } from "./piano-roll-begin";
import { PianoRollEnd } from "./piano-roll-end";

export class OctaveCount {
  constructor(
    private readonly end: PianoRollEnd,
    private readonly begin: PianoRollBegin,
  ) { }
  _get() { return Math.ceil(-(this.end.value - this.begin.value) / 12); }

  static get() { return Math.ceil(-(PianoRollEnd.get() - PianoRollBegin.get()) / 12); }
}
