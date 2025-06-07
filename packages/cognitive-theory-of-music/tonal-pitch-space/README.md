# Tonal-Pitch-Space Module

Implements algorithms from Lerdahl's Tonal Pitch Space theory.

### Main Components
- **src/get-distance.ts**: Computes tonal distance between two chords using region, tonic, and basic-space distances.
- **src/get-keys-include-the-chord.ts**: Lists keys that contain a given chord.

### Key Data Structures
- Functions operate on `RomanChord` and `Chord` representations from `@music-analyzer` packages.

These utilities help evaluate tonal proximity and possible key contexts for chords.
