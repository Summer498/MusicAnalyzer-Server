# View Parameters

This module defines shared constants and helper classes used to calculate sizes and coordinates for the UI. Examples include:

- `PianoRollConverter` for converting MIDI note numbers to screen coordinates.
- Classes like `CurrentTimeX`, `PianoRollWidth`, and `NoteSize` that compute layout values on demand.
- Utility setters such as `setPianoRollParameters` which configure the piano roll based on analyzed melody data.

All visualization packages depend on these parameters to stay in sync with window size and song length.
