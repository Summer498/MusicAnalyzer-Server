# View Utilities

This package provides small helper classes used by different UI components.

- **AudioReflectableRegistry** and **WindowReflectableRegistry** work as simple event registries. Components subscribe to them to receive audio or window update notifications.
- **PianoRollTranslateX** calculates the horizontal offset so that the current time remains centered when the window size changes.

These utilities are shared across the piano roll and spectrogram modules.
