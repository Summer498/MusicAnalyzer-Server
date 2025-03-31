import { WindowReflectableRegistry } from "./facade";
import { OctaveBG } from "../octave/octave-bg";
import { Octaves } from "./octaves";

export class OctaveBGs extends Octaves {
  constructor(publisher: WindowReflectableRegistry) {
    super("octave-BGs", publisher, (_, oct) => new OctaveBG(oct))
  }
}
