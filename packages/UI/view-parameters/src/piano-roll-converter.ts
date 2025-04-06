import { NoteSize } from "./note-size";
import { BlackKeyPrm, PianoRollBegin } from "./song-parameters";

export class PianoRollConverter {
  readonly transposed = (e: number) => e - PianoRollBegin.get()
  readonly scaled = (e: number) => e * NoteSize.get();
  readonly convertToCoordinate = (e: number) => e * BlackKeyPrm.height;
}
