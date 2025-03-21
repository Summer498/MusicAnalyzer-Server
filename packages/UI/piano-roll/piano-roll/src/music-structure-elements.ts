import { BeatElements } from "@music-analyzer/beat-view";
import { ChordElements } from "@music-analyzer/chord-view";
import { MelodyElements } from "@music-analyzer/melody-view";

export class MusicStructureElements {
  constructor(
    readonly beat: BeatElements,
    readonly chord: ChordElements,
    readonly melody: MelodyElements,
  ) { }
}