import { PianoRollWidth } from "./piano-roll-width";
import { PianoRollRatio } from "./piano-roll-ratio";
import { SongLength } from "./song-length";


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
