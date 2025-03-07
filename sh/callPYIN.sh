(
  export PYTHONPATH="./python:"
  . ./MUSIC_ANALYZER/bin/activate

  readonly filepath="$1"
  readonly song_name="$(basename "$1" | sed -e 's/\.[^\.]*$//')"  # 引数から拡張子を取り除く

  readonly pyin_src="./resources/$song_name/demucs/vocals.wav"
  readonly pyin_dst="./resources/$song_name/analyzed/melody/pyin/vocals.f0.json"
  python -m pyin "$pyin_src" --fmin 128 --fmax 4096 -o "$pyin_dst"
)