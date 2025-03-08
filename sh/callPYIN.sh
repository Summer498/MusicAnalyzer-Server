(
  export PYTHONPATH="./python:"
  . ./MUSIC_ANALYZER/bin/activate

  readonly song_name="$1"

  readonly pyin_src="./resources/$song_name/demucs/vocals.wav"
  readonly pyin_dst="./resources/$song_name/analyzed/melody/pyin/vocals.f0.json"
  python -m pyin "$pyin_src" --fmin 128 --fmax 4096 -o "$pyin_dst"
)