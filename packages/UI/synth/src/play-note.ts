import { play } from "./play";

export function play_note(hzs = [330, 440, 550], bpm = 60, note_value = 4, amplitude = 1) {
  play(hzs, 0, 240 / (bpm * note_value), amplitude);
}
