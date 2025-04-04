import { WindowReflectableRegistry } from "@music-analyzer/view";
import { OctaveBG } from "../octave";
import { Octaves } from "./octaves";

export class OctaveBGs extends Octaves {
  constructor(publisher: WindowReflectableRegistry) {
    super("octave-BGs", publisher, (_, oct) => new OctaveBG(oct))
  }
}
