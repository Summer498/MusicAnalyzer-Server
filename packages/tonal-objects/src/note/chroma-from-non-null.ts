import { assertNonNullable } from "@music-analyzer/stdlib/src/assertion/not-null-like";
import { chroma } from "@tonaljs/note";
import { NoteLiteral } from "@tonaljs/pitch-note";

export const chromaFromNonNull = (note: NoteLiteral | null) => chroma(assertNonNullable(note))
