import { BeatElements } from "./beat-elements";
import { ChordElements } from "./chord-elements";
import { MelodyElements } from "./melody-elements";

export class MusicStructureElements {
  constructor(
    readonly beat: BeatElements,
    readonly chord: ChordElements,
    readonly melody: MelodyElements,
  ) { }
}