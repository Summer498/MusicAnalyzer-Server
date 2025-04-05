import { WhiteBG } from "../components";
import { OctaveChunk } from "./octave-chunk";

export class OctaveWhiteBG extends OctaveChunk {
  constructor(oct: number) {
    super(`octave-white-bgs-${oct}`, 7, (_, i) => new WhiteBG(oct, i))
  }
}
