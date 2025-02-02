import { PianoRollBegin } from "./piano-roll-begin";
import { octave_height } from "./piano-roll-constants";
import { PianoRollEnd } from "./piano-roll-end";
import { PianoRollHeight } from "./piano-roll-height";

export class OctaveCount {
  static onUpdate: (() => void)[] = [
    () => { PianoRollHeight.value = octave_height * OctaveCount.value; }
  ];
  static #value = 4;
  static get value() { return this.#value; }
  static set value(value: number) {
    this.#value = value;
    console.log(`OctaveCount.value = ${OctaveCount.value}`);
    this.onUpdate.forEach(event => event());
  }
}

const updateOctaveCount = () => { OctaveCount.value = Math.ceil(-(PianoRollEnd.value - PianoRollBegin.value) / 12); };
PianoRollBegin.onUpdate.push(updateOctaveCount);
PianoRollEnd.onUpdate.push(updateOctaveCount);

