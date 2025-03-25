import { BlackBG } from "../components";
import { OctaveChunk } from "./octave-chunk";

export class OctaveBlackBG extends OctaveChunk {
  constructor(oct: number) {
    super(`octave-black-bgs-${oct}`, 5, (_, i) => new BlackBG(oct, i))
  }
}
