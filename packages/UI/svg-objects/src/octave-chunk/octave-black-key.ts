import { BlackKey } from "../components";
import { OctaveChunk } from "./octave-chunk";

export class OctaveBlackKey extends OctaveChunk {
  constructor(oct: number) {
    super(`octave-black-keys-${oct}`, [...Array(5)].map((_, j) => new BlackKey(oct, j)))
  }
}
