# Chord Analyze CLI

This command line tool converts a sequence of chord symbols into a roman numeral progression.

## Main Functions

- **analyzeAndOutputProgression(chords: TimeAndString[])**
  - Converts `TimeAndString` tuples into `TimeAndChordSymbol` objects, runs `calcChordProgression` from `@music-analyzer/chord-analyze`, and outputs the analysis as JSON.
- **handleArgv(argv: string[])**
  - Parses chord symbols passed as command line arguments and invokes `analyzeAndOutputProgression`.
- **handleStdIn(lines: string[])**
  - Reads JSON from standard input and parses it as a list of chord tuples before analyzing.
- **main(argv: string[])**
  - Chooses between argument or standard‑input processing and runs the tool.

The CLI expects either a space separated list of chord symbols as an argument or a JSON array of `[start, end, chord]` tuples via stdin.
