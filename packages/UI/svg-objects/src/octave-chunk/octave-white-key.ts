import { WhiteKey } from "../components/white-key";
import { OctaveChunk } from "./octave-chunk";

export class OctaveWhiteKey extends OctaveChunk {
  constructor(oct: number) {
    super(`octave-white-keys-${oct}`, 7, (_, i) => new WhiteKey(oct, i))
  }
}
