# IRM Module

Functions for *Implication-Realization Model* (IRM) analysis.

### Main Components
- **src/archetype**: Classes such as `Triad` representing melodic archetypes.
- **src/colors**: Helpers for visualizing IRM results. For example `get_color_on_registral_scale` maps a `Triad` symbol to an RGB color.

### Key Data Structures
- `Triad`: Holds three consecutive notes and determines their archetypal symbol, registral motion, and intervallic motion.
- `Monad`/`Dyad`: Simpler archetypes used to build larger structures.

These elements allow evaluation and visualization of melodic expectation using Narmour's theory.
