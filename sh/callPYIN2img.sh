(
  export PYTHONPATH="./python:"
  . ./MUSIC_ANALYZER/bin/activate

  readonly filepath="$1"
  readonly song_name="$(basename "$1" | sed -e 's/\.[^\.]*$//')"  # 引数から拡張子を取り除く

  readonly pyin_src="./resources/$song_name/demucs/vocals.wav"
  readonly img_src="./resources/$song_name/analyzed/melody/pyin/vocals.f0.json"
  readonly img_dst="./resources/$song_name/analyzed/melody/pyin/vocals.f0.png"
  python -m pyin2img "$img_src" --audio_file "$pyin_src" -o "$img_dst"
)
