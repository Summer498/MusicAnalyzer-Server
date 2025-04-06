import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { SongLength } from "./song-length";
import { PianoRollEnd } from "./piano-roll-end";
import { PianoRollBegin } from "./piano-roll-begin";
import { bracket_height } from "./bracket-height";

export const setPianoRollParameters = (
  hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
) => {
  const last = <T>(arr: T[]) => arr[arr.length - 1];
  const melody = last(hierarchical_melody);

  const song_length = melody.reduce((p, c) => p.time.end > p.time.end ? p : c).time.end * 1.05;
  const highest_pitch = melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note > c.note ? p : c).note || 0;
  const lowest_pitch = melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note < c.note ? p : c).note || 0;
  SongLength.set(song_length)
  PianoRollEnd.set(lowest_pitch - 3);
  PianoRollBegin.set(
    [hierarchical_melody.length]
      .map(e => e * bracket_height)
      .map(e => e / 12)
      .map(e => Math.floor(e))
      .map(e => e * 12)
      .map(e => e + highest_pitch)
      .map(e => e + 12)[0]
  )
}
