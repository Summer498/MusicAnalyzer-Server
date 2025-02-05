import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { _Chord } from "@music-analyzer/tonal-objects";
import { AccompanyToAudio } from "@music-analyzer/view";
import { ChordNameModel } from "./chord-name-model";
import { ChordNameView } from "./chord-name-veiw";

export class ChordNameController implements AccompanyToAudio {
  readonly model: ChordNameModel;
  readonly view: ChordNameView;
  constructor(e: TimeAndRomanAnalysis) {
    this.model = new ChordNameModel(e);
    this.view = new ChordNameView(this.model);
  }
  onAudioUpdate() {
    this.onAudioUpdate();
  }
}

