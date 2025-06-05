import { isSubSet } from "@music-analyzer/math";
import { RomanChord } from "@music-analyzer/roman-chord";
import { createAssertion, createNotImplementedError } from "@music-analyzer/stdlib";
import { getChroma } from "@music-analyzer/tonal-objects";

export const getScaleChroma = (roman: RomanChord) => {
  // TODO: 借用和音に伴いスケール構成音を変異させる
  createAssertion(
    isSubSet(
      roman.chord.notes.map(note => getChroma(note)),
      roman.scale.notes.map(note => getChroma(note)),
    ),
  ).onFailed(() => {
    console.log(`received:`);
    console.log(roman);
    throw createNotImplementedError("借用和音はまだ実装されていません. 入力ローマ数字コードは, コード構成音がスケール内に収まるようにしてください.");
  });
  return roman.scale.notes.map(note => getChroma(note));
};
