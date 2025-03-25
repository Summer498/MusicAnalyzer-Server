import { WhiteBG } from "../components";
import { OctaveChunk } from "./octave-chunk.ts";

export class OctaveWhiteBG extends OctaveChunk {
  constructor(oct: number) {
    super(`octave-white-bgs-${oct}`, [...Array(7)].map((_, i) => new WhiteBG(oct, i)));
  }
}
