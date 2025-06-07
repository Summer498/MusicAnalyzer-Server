# UI Controllers

This package contains reusable classes that create common form controls for the web UI.

## Main classes

- **Controller** and **ControllerView**: base implementation for controls that wrap an HTML input and notify listeners on value changes.
- **Slider**: `Controller` for range inputs. Used by `HierarchyLevelController` and `TimeRangeController` to select melody layer and time range.
- **Checkbox**: simple on/off switch used by many controllers such as `DMelodyController` and `GravityController`.
- **MelodyColorController**: group of radio buttons that chooses how melody notes are colored.
- **MelodyBeepController**: checkbox and volume slider allowing playback of short beep sounds.

These small components can be combined to build interactive views.
