# GTTM Module

This package contains utilities for the *Generative Theory of Tonal Music* (GTTM).

### Main Components
- **src/analysis-result**: Data structures representing GTTM analyses, such as `GroupingStructure`, `MetricalStructure`, `TimeSpanReduction`, and `ProlongationalReduction`.
- **src/sample**: Example data used for testing and demonstration.

### Key Data Structures
- `ReductionElement`: Abstract tree element used by reductions. Provides traversal helpers and depth calculations.
- `TimeSpan` and `ProlongationalReduction`: Represent hierarchical reductions of a piece, capturing rhythm and harmonic functions.

These structures enable the representation and processing of GTTM analysis results within the server.
