import { WhiteKey } from "../components";
import { OctaveChunk } from "./octave-chunk";

export class OctaveWhiteKey extends OctaveChunk {
  constructor(oct: number) {
    super(`octave-white-keys-${oct}`, [...Array(7)].map((_, i) => new WhiteKey(oct, i)))
  }
}
