import { WindowReflectableRegistry } from "@music-analyzer/view";
import { OctaveKey } from "../octave/octave-key";
import { Octaves } from "./octaves";

export class OctaveKeys extends Octaves {
  constructor(publisher: WindowReflectableRegistry) {
    super("octave-keys", publisher, (_, oct) => new OctaveKey(oct))
  }
}
