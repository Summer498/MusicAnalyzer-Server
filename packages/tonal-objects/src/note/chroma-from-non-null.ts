import { assertNonNullable } from "./facade";

import { chroma } from "@tonaljs/note";
import { NoteLiteral } from "@tonaljs/pitch-note";

export const chromaFromNonNull = (note: NoteLiteral | null) => chroma(assertNonNullable(note))
