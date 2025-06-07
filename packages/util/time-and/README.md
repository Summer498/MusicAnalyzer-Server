# @music-analyzer/time-and

Utilities for handling time ranges and searching items by time.

## Features
- `Time` class representing a range with `begin`, `end` and `duration`.
- `search_items_begins_in_range(items, time)` to find items starting within a range.
- `search_items_overlaps_range(items, time)` to find items that overlap a range.
- `compress(array)` to convert a sequence into segments with start/end times.

The module is written in TypeScript and re-exports these helpers from `index.ts`.
