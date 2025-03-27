import { NoteLiteral } from "@music-analyzer/tonal-objects/src/note/note-literal";
import { Triad } from "./triad/Triad";
import { Dyad } from "./Dyad";
import { Monad } from "./Monad";
import { Null_ad } from "./Null-ad";

export function getArchetype(): Null_ad;
export function getArchetype(note: NoteLiteral): Monad;
export function getArchetype(note1: NoteLiteral, note2: NoteLiteral): Dyad;
export function getArchetype(note1: NoteLiteral, note2: NoteLiteral, note3: NoteLiteral): Triad;
export function getArchetype(
  ...args
    : []
    | [NoteLiteral]
    | [NoteLiteral, NoteLiteral]
    | [NoteLiteral, NoteLiteral, NoteLiteral]
) {
  const e = args;
  switch (e.length) {
    case 0: return new Null_ad();
    case 1: return new Monad(e[0]);
    case 2: return new Dyad(e[0], e[1]);
    case 3: return new Triad(e[0], e[1], e[2]);
    default: throw new Error(`Invalid argument length: ${args.length}`)
  }
}
