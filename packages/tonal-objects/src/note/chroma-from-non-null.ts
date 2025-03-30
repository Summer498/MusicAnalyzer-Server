import { assertNonNullable } from "@music-analyzer/stdlib";
import { chroma } from "@tonaljs/note";
import { NoteLiteral } from "@tonaljs/pitch-note";

export const chromaFromNonNull = (note: NoteLiteral | null) => chroma(assertNonNullable(note))
