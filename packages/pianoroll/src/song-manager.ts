import { BeatInfo } from "@music-analyzer/beat-estimation";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { IMelodyModel } from "@music-analyzer/melody-analyze";

export class SongManager {
  readonly beat_info: BeatInfo;
  readonly romans: TimeAndRomanAnalysis[];
  readonly hierarchical_melody: IMelodyModel[][];
  // readonly melodies: IMelodyModel[];
  readonly d_melodies: IMelodyModel[];
  constructor(
    beat_info: BeatInfo,
    romans: TimeAndRomanAnalysis[],
    hierarchical_melody: IMelodyModel[][],
    // melodies: IMelodyModel[],
    d_melodies: IMelodyModel[]
  ) {
    this.beat_info = beat_info;
    this.romans = romans;
    this.hierarchical_melody = hierarchical_melody;
    // this.melodies = melodies;
    this.d_melodies = d_melodies;
  }
}
