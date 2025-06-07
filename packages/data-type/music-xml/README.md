# @music-analyzer/musicxml

Type definitions for MusicXML elements used by the Music Analyzer project.

## Overview

The `index.ts` file exports a set of TypeScript types describing structures found
in a MusicXML `score-partwise` document.  These types make it easier to work
with parsed MusicXML data within TypeScript code.

### Main Types
- **MusicXML** – Top level object containing the `score-partwise` element.
- **ScorePartwise** – Represents a complete score with metadata and parts.
- **Part & Measure** – Definitions for musical parts and measures.
- **Note & Pitch** – Describe individual notes in a measure.

## Usage
Import the needed types when working with parsed XML.

```ts
import type { MusicXML, Note } from "@music-analyzer/musicxml";

function process(score: MusicXML) {
  const firstNote: Note = score["score-partwise"].part.measure[0].note as Note;
  // ...
}
```

These are only type definitions and contain no runtime logic.
