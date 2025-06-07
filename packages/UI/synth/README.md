# Synth Utilities

Utility functions that wrap the Web Audio API for quick sound playback.

- **createGain** and **createOscillator** create basic audio nodes.
- **play** plays arbitrary tones with ADSR envelope settings.
- **play_note** is a helper to play notes based on BPM and note value.

These helpers are used by the UI when short confirmation sounds are needed.
