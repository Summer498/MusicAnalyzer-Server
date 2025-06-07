# Melody Analyze CLI

Analyzes a melody in conjunction with a roman numeral chord progression.

## Main Functions

- **parseArgs(argv: string[])**
  - Uses `yargs` to parse required options: melody file, roman chord file, sampling rate and output file.
- **main(argv: string[])**
  - Reads melody and chord files, converts melody data using `getTimeAndMelody`, runs `analyzeMelody`, and writes the analysis result as JSON.

Provide the options using `--melody_filename`, `--roman_filename`, `--sampling_rate` and `--outfile` or their short aliases.
