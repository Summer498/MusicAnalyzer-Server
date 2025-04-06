import { PianoRollWidth } from "./song-parameters";
import { SongLength } from "./song-parameters";
import { PianoRollRatio } from "./piano-roll-ratio";


class PianoRollTimeLength {
  constructor(
    private readonly ratio: PianoRollRatio,
    private readonly length: SongLength,
  ) { }
  _get() { return this.ratio.value * this.length.value }

  static get() { return PianoRollRatio.get() * SongLength.get(); }
}


export class NoteSize {
  constructor(
    private readonly width: PianoRollWidth,
    private readonly length: PianoRollTimeLength,
  ) { }
  _get() { return this.width._get() / this.length._get(); }

  static get() { return PianoRollWidth.get() / PianoRollTimeLength.get(); }
}
