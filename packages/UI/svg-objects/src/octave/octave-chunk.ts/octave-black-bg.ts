import { BlackBG } from "../../components";
import { OctaveChunk } from ".";

export class OctaveBlackBG extends OctaveChunk {
  constructor(oct: number) {
    super(`octave-black-bgs-${oct}`, [...Array(5)].map((_, i) => new BlackBG(oct, i)))
  }
}
